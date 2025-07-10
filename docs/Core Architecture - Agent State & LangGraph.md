# Phase 3: Core Architecture - AgentState 및 LangGraph 설계

## 1. AgentState 객체 설계 정책

### 1.1 상태 관리 철학
**결정사항**: "완전한 상태 추적 + 복구 가능성" 원칙 채택
- **근거**: PRD에서 명시한 "실패 복구" 요구사항과 투명한 조수석 철학
- **정책**: 모든 워크플로우 실행 과정이 재현 가능하도록 충분한 정보 저장

### 1.2 LangGraph 상태 호환성 설계
**AgentState 구조 원칙**:
- **LangGraph 호환**: 모든 노드가 `AgentState → AgentState` 시그니처 준수
- **불변 이벤트**: 실행된 노드별 결과는 append-only로 기록
- **가변 컨텍스트**: 현재 진행 상황과 워킹 메모리는 업데이트 가능

**필수 필드 구성**:
```python
# 핵심 실행 추적
execution_id: UUID          # 고유 실행 식별자
workflow_id: str           # 워크플로우 템플릿 ID
current_node: str          # 현재 실행 중인 노드 ID
node_history: List[str]    # 실행된 노드 순서

# 노드별 실행 결과 (불변)
node_outputs: Dict[str, NodeOutput]  # 각 노드의 실행 결과
execution_log: List[ExecutionEvent]  # 시간순 실행 이벤트

# 워킹 컨텍스트 (가변)
working_memory: Dict[str, Any]       # 노드 간 데이터 전달
user_inputs: Dict[str, Any]          # 사용자 제공 입력값
intermediate_results: Dict[str, Any]  # 중간 처리 결과
```

### 1.3 노드 실행 결과 추적
**NodeOutput 표준화**:
- `node_id`: 실행된 노드 식별자
- `status`: PENDING/RUNNING/COMPLETED/FAILED/SKIPPED
- `execution_time`: 실행 시간 (초)
- `output_data`: 노드가 생성한 데이터
- `error_info`: 실패 시 에러 정보
- `tokens_used`: LLM 호출 시 토큰 사용량
- `tools_called`: 호출된 도구 목록

### 1.4 메모리 관리 정책
**메모리 분류**:
- `short_term_memory`: 현재 세션 내에서만 유지
- `long_term_memory`: 사용자별로 영구 저장 (향후 개인화에 활용)
- **TTL 정책**: 메모리 항목별로 만료 시간 설정 가능

**상태 불변성 vs 가변성 정책**:
**결정사항**: "Immutable Events + Mutable State" 하이브리드 접근
- **이벤트는 불변**: 한번 기록된 `node_outputs`는 수정 불가
- **상태는 가변**: `current_node`, `status` 등은 업데이트 가능
- **근거**: 감사 추적(audit trail) 유지하면서 실시간 업데이트 효율성 확보

## 2. 하이브리드 LangGraph 워크플로우 아키텍처

### 2.1 설계 원칙: "단순한 정의, 지능적 실행"
**핵심 철학**: "Simple Definition, Intelligent Execution"
- **워크플로우 설계 단순화**: 설계자는 도구의 내부/외부 구현을 신경 쓰지 않고, 통일된 `tool_caller` 노드만 사용한다.
- **실행 엔진의 지능화**: 실행 엔진이 도구의 성격을 파악하여 내부 직접 호출 또는 외부 MCP 호출 중 최적의 경로를 자동으로 선택한다.
- **유연성 및 확장성**: 새로운 도구를 추가하거나 기존 도구의 실행 방식을 변경해도, 워크플로우 정의 자체는 수정할 필요가 없다.

### 2.2 노드 타입: `tool_caller`로의 통일

과거에는 내부 최적화 노드(`rag_search`, `llm_generation`)와 외부 통합 노드(`mcp_tool_caller`)를 구분하는 방식을 고려했으나, 설계의 단순성과 유연성을 극대화하기 위해 **`tool_caller`라는 단일 노드 타입으로 통합**하는 것을 최종 아키텍처로 확정합니다.

워크플로우 설계 관점에서 모든 "도구"는 동일한 방식으로 호출됩니다.

```json
// 내부 RAG 검색과 외부 이메일 전송 모두 'tool_caller'로 호출
{
  "id": "search_internal_docs",
  "type": "tool_caller",
  "name": "내부 문서 검색 (RAG)",
  "config": {
    "tool_name": "rag_knowledge_search",
    // ...
  }
},
{
  "id": "send_notification_email",
  "type": "tool_caller",
  "name": "결과 이메일 전송",
  "config": {
    "tool_name": "send_email",
    // ...
  }
}
```

### 2.3 하이브리드 노드 실행 엔진
**NodeExecutionEngine 아키텍처**:
`tool_caller` 노드의 실행을 담당하는 `HybridNodeExecutor`는 내부적으로 다음과 같이 동작합니다.

1.  **Tool Registry 조회**: `tool_caller` 노드의 `tool_name`을 중앙 `ToolRegistry`에서 조회합니다.
2.  **실행 경로 결정**: `ToolRegistry`는 해당 도구가 '내부(internal)'인지 '외부(external)'인지에 대한 정보와 함께 실행에 필요한 메타데이터를 반환합니다.
3.  **최적화된 실행**:
    *   **내부 경로**: `rag_knowledge_search`와 같이 내부로 등록된 도구는, 네트워크 오버헤드 없이 직접 `RAGService`의 해당 메서드를 호출하여 최고 성능을 보장합니다.
    *   **외부 경로**: `send_email`과 같이 외부로 등록된 도구는, `MCPClientManager`를 통해 표준 MCP 프로토콜로 외부 도구 서버와 통신하여 확장성을 확보합니다.

```python
class HybridNodeExecutor:
    def __init__(self):
        # 도구의 실행 방식(내부/외부)과 메타데이터를 관리
        self.tool_registry = ToolRegistry() 
        
        # 내부 서비스 직접 접근 핸들러
        self.internal_services = {"rag": RAGService(), "llm": LLMService()}
        
        # MCP 기반 외부 도구 매니저
        self.mcp_client = MCPClientManager()

    async def execute_node(self, node_config: dict, state: AgentState) -> AgentState:
        # 1. 노드 타입이 tool_caller인지 확인
        if node_config["type"] != "tool_caller":
            # 다른 제어 노드 등 처리
            return await self._execute_control_node(node_config, state)

        # 2. Tool Registry에서 도구 정보 조회
        tool_name = node_config["config"]["tool_name"]
        tool_meta = self.tool_registry.get_tool(tool_name)
        
        # 3. 실행 경로에 따라 분기
        if tool_meta.execution_type == "internal":
            # 내부 서비스 직접 호출
            service = self.internal_services[tool_meta.service_name]
            result = await getattr(service, tool_meta.method_name)(node_config["config"]["inputs"])
            return self.update_state_with_result(state, result)
            
        elif tool_meta.execution_type == "external":
            # 외부 MCP 도구 호출
            result = await self.mcp_client.execute_tool(tool_name, node_config["config"]["inputs"])
            return self.update_state_with_result(state, result)
```

### 2.4 절차 기반 vs 자율 모드 구현 전략

#### **절차 기반 모드 (Procedural Mode)**
**특징**:
- **고정 시퀀스**: 사전 정의된 노드 순서로 실행
- **예측 가능성**: 동일 입력에 대해 일관된 실행 경로
- **효율성**: 불필요한 추론 단계 없이 직진
- **최적화**: 하이브리드 실행 엔진이 노드별 최적 경로 자동 선택

**구현 방식**:
- JSON 템플릿의 고정된 엣지 구조
- 조건부 분기는 비즈니스 로직 기반 (데이터 검증, 권한 체크 등)
- 모든 도구는 `tool_caller`를 통해 호출되며, 엔진이 실행 방식 결정

#### **자율 모드 (Autonomous Mode)**
**특징**:
- **ReAct 패턴**: Reasoning → Acting → Observing 순환
- **동적 도구 선택**: 상황에 따라 최적의 `tool_name`을 동적으로 선택
- **적응성**: 예상치 못한 상황에 유연하게 대응
- **지능적 경로 결정**: 성능과 기능의 트레이드오프를 고려하여 도구 선택

**구현 방식**:
- `plan_generator` 노드가 다음 액션에 가장 적합한 `tool_name`을 계획
- `tool_executor` 노드가 `plan_generator`가 선택한 `tool_name`을 받아 `tool_caller` 노드를 실행
- `result_evaluator` 노드가 결과 평가 후 계속/완료 판단
- 순환 구조로 목표 달성까지 반복

### 2.5 하이브리드 접근법
**Phase 2+ 구현 예정**:
- 절차 기반 워크플로우 내 특정 노드에서 자율 모드 호출
- 자율 모드가 복잡한 문제를 해결 후 절차 기반으로 복귀
- 사용자가 실행 시점에 모드 선택 가능

## 3. 하이브리드 WorkflowService 구현 정책

### 3.1 템플릿 로딩 및 노드 분석 전략
**결정사항**: "Template Analysis + Smart Routing" 전략
- **템플릿 분석**: 로드 시점에 내부/외부 노드 비율 분석
- **경로 최적화**: 내부 노드 우선 배치로 성능 극대화
- **의존성 체크**: MCP 서버 가용성에 따른 대체 경로 준비

### 3.2 하이브리드 노드 팩토리 설계
**이중 팩토리 패턴**:
```python
class HybridNodeFactory:
    def __init__(self, dependencies: NodeDependencies):
        # 내부 서비스 의존성
        self.rag_service = dependencies.rag_service
        self.llm_service = dependencies.llm_service
        self.memory_service = dependencies.memory_service
        
        # 외부 MCP 의존성
        self.mcp_client = dependencies.mcp_client
        
        # 노드 생성 전략 매핑
        self.internal_creators = {
            "rag_search": self._create_internal_rag_node,
            "llm_generation": self._create_internal_llm_node,
            "memory_updater": self._create_internal_memory_node
        }
        
        self.external_creators = {
            "mcp_tool_caller": self._create_mcp_tool_node,
            "api_caller": self._create_mcp_api_node,
            "file_handler": self._create_mcp_file_node
        }
    
    def create_node(self, node_config: dict) -> Callable[[AgentState], AgentState]:
        node_type = node_config["type"]
        
        # 내부 노드 우선 생성
        if node_type in self.internal_creators:
            return self.internal_creators[node_type](node_config)
        # 외부 노드 생성
        elif node_type in self.external_creators:
            return self.external_creators[node_type](node_config)
        else:
            raise UnsupportedNodeTypeError(f"Unknown node type: {node_type}")
```

### 3.3 성능 기반 실행 컨텍스트 관리
**스마트 상태 전파 정책**:
- **내부 노드 간**: 직접 메모리 참조로 최고 성능
- **외부 노드로**: 직렬화된 상태 전달
- **외부 노드에서**: 역직렬화 후 상태 업데이트
- **하이브리드 체크포인트**: 내부→외부 전환 지점에서 상태 저장

### 3.4 조건부 라우팅 및 동적 흐름
**조건부 엣지 구현**:
```json
{
  "from": "decision_node",
  "to": "option_a",
  "condition": {
    "type": "expression",
    "expression": "state.confidence_score > 0.8"
  }
}
```

**루프 및 반복 처리**:
- **while 루프**: 조건 만족까지 반복
- **for 루프**: 리스트/배열 순회 처리
- **무한 루프 방지**: 최대 반복 횟수 제한

## 4. 하이브리드 성능 최적화 정책

### 4.1 차별화된 성능 최적화
**내부 노드 초고속 처리**:
- **직접 메모리 접근**: 상태 객체의 참조 전달로 복사 오버헤드 제거
- **연결 풀 재사용**: DB/벡터DB 연결을 워크플로우 생명주기 동안 유지
- **컴파일 타임 최적화**: 자주 사용되는 내부 노드는 사전 컴파일된 함수 사용

**외부 노드 안정성 우선**:
- **연결 풀 관리**: MCP 서버별 독립적인 연결 풀
- **타임아웃 및 재시도**: 네트워크 불안정성을 고려한 robust한 에러 처리
- **백프레셔 제어**: 느린 외부 도구가 전체 성능에 미치는 영향 최소화

### 4.2 지능적 노드 배치 및 병렬 실행
**성능 기반 실행 순서 최적화**:
```python
class WorkflowOptimizer:
    def optimize_execution_plan(self, workflow: dict) -> dict:
        # 1. 내부 노드를 앞쪽으로 재배치
        internal_nodes = self.identify_internal_nodes(workflow)
        external_nodes = self.identify_external_nodes(workflow)
        
        # 2. 병렬 실행 가능한 노드 그룹 식별
        parallel_groups = self.find_parallel_opportunities(workflow)
        
        # 3. 내부 노드 우선 병렬 실행
        optimized_groups = self.prioritize_internal_parallel(parallel_groups)
        
        return self.rebuild_workflow_with_optimization(workflow, optimized_groups)
```

**하이브리드 배치 처리**:
- **내부 노드 배치**: 여러 내부 노드를 한 번에 실행하여 메모리 사용 효율성 극대화
- **외부 노드 배치**: 동일 MCP 서버의 여러 도구를 배치로 호출
- **혼합 파이프라인**: 내부 처리 결과를 외부 도구로 일괄 전송

## 5. 하이브리드 테스트 전략

### 5.1 노드별 차별화된 테스트 접근법
**내부 노드 테스트 (고속 단위 테스트)**:
- **직접 테스트**: 외부 의존성 없는 순수 함수 테스트
- **실제 DB 연동**: 테스트용 Qdrant/PostgreSQL 인스턴스 사용
- **성능 검증**: 응답 시간 < 150ms 보장
- **메모리 효율성**: 메모리 누수 및 가비지 컬렉션 최적화 검증

**외부 노드 테스트 (Mock 기반)**:
- **MCP 서버 Mock**: 실제 외부 의존성 없이 독립적 테스트
- **네트워크 시뮬레이션**: 타임아웃, 재시도, 에러 시나리오 테스트
- **호환성 검증**: 다양한 MCP 서버 버전과의 호환성 확인

### 5.2 통합 테스트에서의 하이브리드 검증
**End-to-End 혼합 시나리오**:
```python
async def test_hybrid_workflow_execution():
    """내부 노드와 외부 노드가 혼재된 실제 워크플로우 테스트"""
    
    # 1. 내부 RAG 검색 (실제 벡터DB)
    rag_result = await execute_internal_rag_node(query="test")
    assert len(rag_result) > 0
    assert response_time < 0.15  # 150ms
    
    # 2. 외부 API 호출 (Mock MCP 서버)
    with MockMCPServer("test_api") as mock_server:
        api_result = await execute_mcp_node(tool="test_api")
        assert api_result.success
        assert response_time < 2.0  # 2초
    
    # 3. 내부 LLM 생성 (실제 LLM + 캐시)
    llm_result = await execute_internal_llm_node(context=rag_result)
    assert llm_result.quality_score > 0.8
```

### 5.3 성능 회귀 방지 테스트
**벤치마크 기반 품질 게이트**:
- **내부 노드**: 각 릴리스마다 성능 저하 < 5% 보장
- **외부 노드**: MCP 프로토콜 오버헤드 < 100ms 유지
- **전체 워크플로우**: 내부/외부 비율에 따른 예상 성능 모델 검증

## 6. 하이브리드 모니터링 및 관찰성

### 6.1 차별화된 실행 추적
**내부 노드 고해상도 모니터링**:
- **마이크로초 단위 성능 추적**: 내부 노드의 세밀한 성능 분석
- **메모리 사용 패턴**: 가비지 컬렉션, 메모리 풀 효율성 모니터링
- **캐시 히트율**: RAG 캐시, LLM 캐시 효율성 측정
- **직접 DB 연결 상태**: Qdrant, PostgreSQL 연결 풀 상태

**외부 노드 네트워크 중심 모니터링**:
- **MCP 서버별 성능 메트릭**: 응답 시간, 에러율, 가용성
- **네트워크 지연 분석**: 프로토콜 오버헤드, 직렬화 비용
- **외부 의존성 추적**: 서드파티 API의 성능 영향도 분석

### 6.2 하이브리드 성능 대시보드
**실행 경로별 성능 비교**:
```python
performance_metrics = {
    "internal_nodes": {
        "rag_search": {"avg_time": "85ms", "success_rate": "99.8%"},
        "llm_generation": {"avg_time": "1.2s", "cache_hit": "67%"},
        "memory_update": {"avg_time": "2ms", "throughput": "5000/sec"}
    },
    "external_nodes": {
        "mcp_tool_caller": {"avg_time": "850ms", "success_rate": "97.2%"},
        "api_caller": {"avg_time": "1.1s", "timeout_rate": "1.5%"},
        "file_handler": {"avg_time": "2.3s", "batch_efficiency": "78%"}
    },
    "hybrid_efficiency": {
        "internal_external_ratio": "70:30",
        "overall_performance_gain": "2.3x",
        "cost_efficiency": "45% reduction"
    }
}
```

### 6.3 최적화 제안 시스템
**지능적 아키텍처 개선 제안**:
- **내부 이전 후보**: 자주 사용되는 외부 노드의 내부화 제안
- **외부 이전 후보**: 복잡도 대비 성능 이득이 낮은 내부 노드의 외부화 제안
- **병렬화 기회**: 내부/외부 노드 간 최적 병렬 실행 패턴 제안
- **캐싱 최적화**: 반복 호출 패턴 기반 캐싱 전략 개선 제안

이 하이브리드 Core Architecture 설계를 통해 성능과 확장성을 모두 확보하면서도, 개발 복잡도를 효과적으로 관리할 수 있는 견고한 기반을 제공합니다.