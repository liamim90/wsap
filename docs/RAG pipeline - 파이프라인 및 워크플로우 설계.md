---

# **RAG Pipeline & Workflow Integration Design**

*   **문서 버전:** v1.0
*   **작성일:** 2025년 7월 10일
*   **문서 목적:** 사용자의 데이터를 안전하게 처리하여 지식 베이스를 구축하는 RAG 데이터 파이프라인과, 이를 워크플로우 내에서 효과적으로 활용하는 검색 기능의 상세 아키텍처를 설계합니다.

## **1. RAG 데이터 처리 파이프라인 고도화**
사용자 데이터를 안정적이고 확장 가능하며 안전하게 처리하는 파이프라인을 설계합니다.

### **1.1 아키텍처 개요**
파일 업로드부터 벡터 DB 저장까지의 전체 흐름을 시각화하면 다음과 같습니다.

+-----------+      +-------------------------+      +-----------------+      +--------------------+
| User      |----->| FastAPI Upload Endpoint |----->| Celery          |----->| RAG Pipeline       |
| (File Up) |      | (POST /rag/upload)      |      | (Message Queue) |      | (Async Workers)    |
+-----------+      +-------------------------+      +-----------------+      +--------------------+
                           | 1. 202 Accepted + file_id                                |
                           | 2. File DB에 'PENDING' 상태로 레코드 생성                     |
                           |                                                          |
                           V                                                          V
                  +----------------+                                   +------------------------------+
                  | PostgreSQL DB  | <----------------------------------| 1. Parse -> 2. Chunk         |
                  | (File, Chunk)  |    (상태 업데이트: PROCESSING,      | 3. Embed -> 4. Store         |
                  +----------------+      COMPLETED, FAILED)           +------------------------------+
                                                                                       |
                                                                                       V
                                                                                +-------------+
                                                                                | Qdrant      |
                                                                                | (Vector DB) |
                                                                                +-------------+
																				
### **1.2 멀티테넌시 데이터 격리 설계**
PRD의 '개인용 컬렉션' 요구사항을 충족시키기 위해 사용자별 데이터 격리는 필수적입니다.

#### **1.2.1 PostgreSQL (메타데이터 관리)**
- File 및 Chunk 테이블에 user_id 컬럼을 추가하고, Foreign Key로 User 테이블과 연결합니다.
- 모든 쿼리 시 user_id를 WHERE 절에 포함하여 데이터 접근을 철저히 격리합니다.
- 고도화 방안: 엔터프라이즈급 보안을 위해 PostgreSQL의 RLS (Row-Level Security) 정책을 도입하여, DB 레벨에서 데이터 소유권을 강제할 수 있습니다.

---
```Python

# models/file.py - SQLAlchemy 모델 예시
import uuid
from sqlalchemy import Column, String, Text, ForeignKey, UUID
from sqlalchemy.orm import relationship
# from pgvector.sqlalchemy import Vector # pgvector 사용 시

class File(Base):
    __tablename__ = 'files'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False, default='PENDING') # PENDING, PROCESSING, COMPLETED, FAILED
    error_message = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    user = relationship("User")
    chunks = relationship("Chunk", back_populates="file")

class Chunk(Base):
    __tablename__ = 'chunks'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    # embedding = Column(Vector(1024)) # pgvector 사용 예시
    file_id = Column(UUID(as_uuid=True), ForeignKey('files.id'), nullable=False)
    file = relationship("File", back_populates="chunks")

```
---

#### **1.2.2 Qdrant(벡터 데이터 관리)
- 단일 컬렉션 (rag_collection)을 사용하되, 각 벡터의 payload에 user_id와 file_id를 저장하여 논리적으로 데이터를 분리합니다. 이 방식은 컬렉션 수 증가로 인한 관리 복잡성 및 성능 저하를 방지합니다.
- 검색 시 filter 조건을 사용하여 특정 사용자의 데이터만 조회하도록 강제합니다.

---
```Python

# qdrant_client.upsert 호출 시 payload 구조
payload = {
    "user_id": str(user_id),
    "file_id": str(file_id),
    "chunk_id": str(chunk.id),
    "text": chunk.content
}

# qdrant_client.search 호출 시 filter 구조
from qdrant_client.models import Filter, FieldCondition, MatchValue

filter = Filter(
    must=[
        FieldCondition(key="user_id", match=MatchValue(value=str(current_user_id)))
    ]
)

```
---

### **1.3 비동기 처리와 상태 관리**
Celery를 이용한 비동기 파이프라인의 각 단계와 File 모델의 상태 변화를 명확히 정의합니다.

#### **1.3.1 File 모델 상태(Enum으로 관리):
- PENDING: 파일 정보가 DB에 생성되었지만, 업로드가 완료되지 않은 초기 상태.
- UPLOADING: 파일이 서버로 스트리밍/업로드 중인 상태.
- PROCESSING: 업로드 완료 후, Celery 워커가 파싱, 청킹, 임베딩, 저장 작업을 수행 중인 상태.
- COMPLETED: 모든 파이프라인 작업이 성공적으로 완료되어 검색 가능한 상태.
- FAILED: 파이프라인 처리 중 오류가 발생한 상태. error_message 필드에 오류 내용 기록.

#### **1.3.2 Celery Task Chaining**
- 각 단계를 독립적인 태스크로 만들고 체인으로 연결하여 파이프라인의 견고성과 재시도 용이성을 확보합니다.

---
```Python

# tasks.py - Celery 태스크 체인 예시
from celery import shared_task, chain

@shared_task(bind=True)
def process_file_pipeline(self, file_id: str, user_id: str):
    # 1. 상태를 PROCESSING으로 변경
    update_file_status(file_id, 'PROCESSING')

    # 2. 태스크 체인 생성
    pipeline = chain(
        parse_task.s(file_id, user_id),
        chunk_task.s(user_id),
        embed_and_store_task.s(user_id)
    )

    # 3. 체인 실행 및 에러 핸들링
    pipeline.apply_async(
        link=complete_task.s(file_id),
        link_error=fail_task.s(self.request.id, file_id) # task_id와 file_id 전달
    )

@shared_task
def complete_task(results, file_id: str):
    update_file_status(file_id, 'COMPLETED')

@shared_task
def fail_task(request, exc, traceback, task_id: str, file_id: str):
    # request 객체에서 file_id를 직접 가져오는 대신 명시적으로 전달
    update_file_status(file_id, 'FAILED', str(exc))

# 더미 함수들
def update_file_status(file_id, status, error=None): pass
@shared_task
def parse_task(file_id, user_id): pass
@shared_task
def chunk_task(parsed_data, user_id): pass
@shared_task
def embed_and_store_task(chunked_data, user_id): pass

```
---

### **1.4 동적 API 키 사용 아키텍처**
사용자별 API 키를 요청 시점에 안전하게 가져와 사용하는 구조를 설계합니다.

#### **1.4.1 SecretsService 추상화**
- PRD 요구사항에 따라 AWS Secrets Manager, Vault 등을 지원하는 SecretsService를 구현합니다. 이 서비스는 내부적으로 캐싱(짧은 TTL)을 적용하여 반복적인 외부 API 호출을 줄일 수 있습니다.
- get_api_key(user_id: str, service_name: str) -> str 인터페이스를 정의합니다. (service_name 예: 'openai', 'voyageai')

#### **1.4.2 서비스 의존성 주입(Dependency Injection)
- FastAPI의 의존성 주입 시스템을 활용하여, EmbeddingService, LLMService 등 API 키가 필요한 서비스에 SecretsService를 주입합니다.

#### **1.4.3 Celery 워커에서의 키 사용**
- Celery 태스크는 user_id를 파라미터로 받아야 합니다.
- 태스크 실행 시, 받은 user_id를 사용하여 SecretsService를 통해 해당 유저의 API 키를 조회하고 임베딩/LLM 클라이언트를 동적으로 초기화합니다. 키를 코드나 설정 파일에 저장하지 않습니다.

---
```Python

# services/embedding_service.py
from typing import List
from openai import OpenAI

class SecretsService:
    def get_api_key(self, user_id: str, service_name: str) -> str:
        # 실제 Secrets Manager/Vault 연동 로직
        return "user_specific_api_key"

class EmbeddingService:
    def __init__(self, secrets_service: SecretsService):
        self.secrets_service = secrets_service

    def get_embeddings(self, texts: List[str], user_id: str):
        api_key = self.secrets_service.get_api_key(user_id, 'openai')
        openai_client = OpenAI(api_key=api_key)
        # ... 임베딩 생성 로직 ...
        response = openai_client.embeddings.create(input=texts, model="text-embedding-3-small")
        embeddings = [item.embedding for item in response.data]
        return embeddings

```
---

## **2. RAG 검색 기능 및 워크플로우 통합**
실제 워크플로우에서 지식 베이스를 활용하는 방안을 구체화합니다.

### **2.1 RetrievalService 상세 설계**
하이브리드 검색과 Re-ranker를 통합한 RetrievalService를 LangChain Tool로 래핑합니다.

#### **2.1.1 RetrievalService 구성 요소**
- Keyword Extractor: 사용자 질문에서 키워드를 추출합니다. (예: LLM 사용 또는 간단한 TF-IDF)
- Vector Searcher: Qdrant에서 user_id로 필터링된 벡터 검색을 수행합니다.
- Keyword Searcher: PostgreSQL의 FTS(Full-Text Search)를 사용하여 키워드 검색을 수행합니다.
- Re-ranker: 두 검색 결과를 합친 후, 관련도 높은 순으로 재정렬합니다.(모델은 추후 선정 Cohere Rerank or BGE-Reranker-Large)
- Context Formatter: 최종 선택된 청크들을 LLM 프롬프트에 맞게 포맷팅합니다.

#### **2.1.2 LangChain Tool 래핑**
---
```Python

from typing import Type
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

class RetrievalService:
    def hybrid_search(self, query: str, user_id: str): return []
    def rerank(self, query: str, results: list): return []
    def format_context(self, results: list): return ""

class RAGSearchInput(BaseModel):
    query: str = Field(description="The user's question for the knowledge base.")
    user_id: str = Field(description="The ID of the user performing the search.")

class RAGSearchTool(BaseTool):
    name = "rag_knowledge_search"
    description = "Searches the user's private knowledge base to answer questions."
    args_schema: Type[BaseModel] = RAGSearchInput
    retrieval_service: RetrievalService # 의존성 주입

    def _run(self, query: str, user_id: str) -> str:
        # 1. 하이브리드 검색 수행 (벡터 + 키워드)
        initial_results = self.retrieval_service.hybrid_search(query, user_id)
        # 2. Re-ranking
        reranked_results = self.retrieval_service.rerank(query, initial_results)
        # 3. 컨텍스트 포맷팅
        formatted_context = self.retrieval_service.format_context(reranked_results)
        return formatted_context

```
---

### **2.2 '문서 기반 Q&A' 워크플로우 그래프 예시 **
Core Architecture 문서의 AgentState와 LangGraph 설계를 기반으로 구체적인 워크플로우를 정의합니다.

#### **2.2.1 그래프 구조(JSON 유사 표현)**
---
```JSON

{
  "nodes": [
    { "id": "start", "type": "workflow_start" },
    {
      "id": "rag_search",
      "type": "tool_caller",
      "config": {
        "tool_name": "rag_knowledge_search",
        "input_mapping": {
          "query": "state.user_inputs.query",
          "user_id": "state.user_info.id"
        },
        "output_key": "retrieved_context"
      }
    },
    {
      "id": "generate_answer",
      "type": "tool_caller",
      "config": {
        "tool_name": "llm_generation",
        "prompt_template": "Context:\n{context}\n\nQuestion: {query}\n\nAnswer:",
        "input_mapping": {
          "context": "state.working_memory.retrieved_context",
          "query": "state.user_inputs.query"
        },
        "output_key": "final_answer"
      }
    },
    { "id": "end", "type": "workflow_end" }
  ],
  "edges": [
    { "from": "start", "to": "rag_search" },
    { "from": "rag_search", "to": "generate_answer" },
    { "from": "generate_answer", "to": "end" }
  ]
}

```
---
**아키텍처 노트**: 위 예시와 같이, 성능을 위해 내부적으로 직접 호출되는 RAG 검색(`rag_knowledge_search`)이나 LLM 호출(`llm_generation`) 기능 또한, 워크플로우 정의의 일관성과 단순성을 위해 표준화된 `tool_caller` 노드 타입을 사용하여 호출합니다. 하이브리드 실행 엔진은 `tool_name`을 기반으로 이것이 내부 최적화 경로로 실행되어야 함을 자동으로 인지하고 처리합니다.

#### **2.2.2 AgentState 데이터 흐름**
- start: state.user_inputs에 { "query": "사용자 질문" }이 저장되고, state.user_info에 사용자 정보가 포함됩니다.
- rag_search: RAGSearchTool을 호출합니다. 실행 후 state.working_memory에 { "retrieved_context": "검색 및 재정렬된 문서 내용..." }이 추가됩니다.
- generate_answer: retrieved_context와 query를 프롬프트 템플릿에 주입하여 LLM을 호출합니다. 이 때 해당 user_id의 LLM API 키를 동적으로 사용해야 합니다. 결과는 state.node_outputs에 저장되고, final_answer 키로 working_memory에 추가될 수 있습니다.
- end: state.working_memory.final_answer를 최종 결과로 포맷팅하여 사용자에게 반환합니다.