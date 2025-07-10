# Phase 3: Workflow Translation - 사용자 입력을 실행 가능한 워크플로우로 변환

## 1. 워크플로우 변환 시스템 개요

### 1.1 변환 시스템의 핵심 가치
**문제 정의**: 사용자의 간단한 업무 설명을 완전히 실행 가능한 JSON 워크플로우로 변환
- **입력**: 자연어 + 간단한 구조화된 단계
- **출력**: LangGraph 호환 JSON 워크플로우 템플릿
- **목표**: 기술적 복잡성을 숨기고 사용자 친화적인 워크플로우 생성 경험 제공

### 1.2 변환 시스템 설계 원칙
**지능형 추론 기반 변환**:
- **LLM 활용**: 사용자 의도 파악 및 비즈니스 로직 분석
- **규칙 기반 매핑**: 명확한 패턴의 도구 및 노드 매핑
- **사용자 검증**: 변환 결과를 사용자가 검토하고 수정할 수 있는 기회 제공

**점진적 상세화 접근법**:
1. **기본 구조 생성**: 사용자 단계를 기본 노드 시퀀스로 변환
2. **비즈니스 로직 추가**: 조건부 분기, 에러 처리, 재시도 로직 추가
3. **최적화 및 검증**: 성능 최적화 및 실행 가능성 검증

## 2. 사용자 입력 형식 및 파싱

### 2.1 표준 사용자 입력 구조
**YAML 기반 간소 형식**:
```yaml
# 사용자가 작성하는 간단한 워크플로우 정의
workflow_title: "고객 상품 해지 처리"
description: "고객의 상품 해지 요청을 체계적으로 처리하는 업무"
target_users: ["고객 상담원", "CS 매니저"]

# 기본 설정
settings:
  estimated_duration: "10-15분"
  complexity: "medium" 
  requires_approval: true

# 단계별 업무 정의
steps:
  - step: 1
    title: "고객 식별"
    description: "고객 ID나 전화번호로 고객 정보를 조회합니다"
    tool: "고객 정보 조회 API"
    expected_input: "고객 ID 또는 전화번호"
    expected_output: "고객 기본 정보, 계약 상태"
    
  - step: 2
    title: "본인 인증"
    description: "SMS 또는 ARS를 통해 본인 인증을 진행합니다"
    tool: "본인인증 API"
    conditions: "고객 정보 조회 성공 시"
    failure_action: "인증 실패 시 상담 종료"
    
  - step: 3
    title: "해지 대상 서비스 확인"
    description: "고객이 가입한 서비스 중 해지 요청 서비스를 특정합니다"
    tool: "서비스 조회 API"
    user_interaction: "고객에게 해지할 서비스 확인 필요"
    
  - step: 4
    title: "약관 및 위약금 안내"
    description: "해지 약관과 발생할 수 있는 위약금을 안내합니다"
    tool: "AI 생성"
    template: "약관_위약금_안내_템플릿"
    
  - step: 5
    title: "고객 유인책 제시"
    description: "해지를 만류하기 위한 혜택이나 대안을 제시합니다"
    tool: "AI 생성" 
    conditions: "고객 등급 및 서비스 이용 이력 고려"
    user_choice: ["혜택 수락", "해지 진행"]
    
  - step: 6
    title: "해지 처리 실행"
    description: "고객이 해지를 최종 결정한 경우 해지 처리를 진행합니다"
    tool: "해지 처리 API"
    conditions: "고객이 해지 진행 선택 시"
    rollback: "처리 실패 시 이전 상태로 복구"
    
  - step: 7
    title: "처리 결과 안내"
    description: "해지 처리 결과와 후속 조치를 안내합니다"
    tool: "AI 생성"
    include_docs: ["해지 확인서", "후속 조치 안내"]
    
  - step: 8
    title: "상담 기록 저장"
    description: "전체 상담 내용과 처리 결과를 시스템에 기록합니다"
    tool: "상담 이력 저장 API"
    metadata: ["상담 시간", "처리 결과", "고객 만족도"]
```

### 2.2 입력 파싱 및 구조화
**파싱 단계**:
1. **YAML 파싱**: 기본 구조 및 메타데이터 추출
2. **단계 분석**: 각 단계의 의도 및 요구사항 파악
3. **의존성 분석**: 단계 간 데이터 흐름 및 조건 파악
4. **도구 매핑**: 언급된 도구를 실제 MCP 도구로 매핑

**파싱 결과 중간 표현**:
```python
@dataclass
class ParsedWorkflowStep:
    step_number: int
    title: str
    description: str
    tool_hint: str
    input_requirements: List[str]
    output_expectations: List[str]
    conditions: Optional[str]
    user_interactions: List[str]
    error_handling: Optional[str]
    business_rules: List[str]
```

## 3. 도구 매핑 및 노드 변환

### 3.1 도구 자동 인식 시스템
**키워드 기반 1차 매핑**:
```python
TOOL_KEYWORD_MAPPING = {
    # API 호출 패턴
    r".*API$|.*api$|.*조회$|.*확인$": "mcp_tool_caller",
    r"데이터베이스|DB|조회|검색": "mcp_tool_caller", 
    
    # AI 생성 패턴
    r"AI 생성|자동 생성|텍스트 생성|안내문": "llm_generation",
    r"추천|제안|분석|요약": "llm_generation",
    
    # 사용자 상호작용 패턴
    r"고객.*선택|사용자.*입력|승인.*요청": "user_interaction",
    r"확인.*필요|대기|입력.*받기": "user_interaction",
    
    # 파일 처리 패턴
    r"파일|문서|업로드|다운로드": "file_handler",
    r"이미지|PDF|엑셀|CSV": "file_handler"
}
```

**LLM 기반 2차 분석**:
```python
class IntelligentToolMapper:
    async def analyze_and_map_tool(self, step_description: str, context: dict) -> ToolMapping:
        prompt = f"""
        다음 업무 단계를 분석하여 적절한 도구 타입을 결정해주세요:
        
        단계 설명: {step_description}
        컨텍스트: {context}
        
        사용 가능한 도구 타입:
        - mcp_tool_caller: 외부 API나 시스템 호출
        - llm_generation: AI 텍스트 생성, 분석, 추천
        - user_interaction: 사용자 입력 대기, 선택 요청
        - data_processor: 데이터 변환, 계산, 집계
        - file_handler: 파일 처리, 업로드, 다운로드
        - validator: 데이터 검증, 규칙 확인
        
        응답 형식:
        {{
            "primary_tool": "도구_타입",
            "confidence": 0.9,
            "reasoning": "선택 이유",
            "alternative_tools": ["대안_도구1", "대안_도구2"],
            "required_config": {{"설정_키": "설정_값"}}
        }}
        """
        
        response = await self.llm_client.generate(prompt)
        return ToolMapping.parse_raw(response)
```

### 3.2 MCP 도구 매핑 테이블
**도메인별 도구 매핑**:
```yaml
# 고객 서비스 도메인
customer_service_tools:
  "고객 정보 조회": 
    mcp_tool: "customer_lookup"
    server: "customer_api"
    description: "고객 ID로 기본 정보 및 계약 정보 조회"
    
  "본인인증":
    mcp_tool: "identity_verification"  
    server: "auth_service"
    description: "SMS, ARS, 생체인증 등을 통한 본인 확인"
    
  "서비스 조회":
    mcp_tool: "service_inquiry"
    server: "service_api"
    description: "고객의 가입 서비스 목록 및 상태 조회"
    
  "해지 처리":
    mcp_tool: "service_cancellation"
    server: "billing_api"
    description: "서비스 해지 및 정산 처리"

# 데이터 분석 도메인  
data_analysis_tools:
  "데이터 분석":
    mcp_tool: "data_analyzer"
    server: "analytics_service"
    description: "CSV, Excel 데이터 분석 및 시각화"
    
  "통계 계산":
    mcp_tool: "statistical_calculator"
    server: "math_service"
    description: "기술통계, 상관분석, 회귀분석 등"
```

### 3.3 노드 설정 자동 생성
**설정 템플릿 기반 생성**:
```python
class NodeConfigGenerator:
    def generate_mcp_tool_config(self, tool_mapping: ToolMapping, step_context: ParsedWorkflowStep) -> dict:
        base_config = {
            "tool_name": tool_mapping.mcp_tool,
            "server_hint": tool_mapping.server,
            "timeout_seconds": 30,
            "retry_config": {"max_retries": 3}
        }
        
        # 입력 매핑 자동 생성
        input_mapping = self.generate_input_mapping(step_context.input_requirements)
        base_config["input_mapping"] = input_mapping
        
        # 출력 키 자동 설정
        output_key = self.generate_output_key(step_context.title)
        base_config["output_key"] = output_key
        
        # 에러 처리 정책 추가
        if step_context.error_handling:
            base_config["error_handling"] = self.parse_error_handling(step_context.error_handling)
            
        return base_config
        
    def generate_llm_config(self, step_context: ParsedWorkflowStep) -> dict:
        return {
            "model": "gpt-4",
            "temperature": 0.1,
            "max_tokens": 1000,
            "system_prompt": self.generate_system_prompt(step_context),
            "prompt_template": self.generate_prompt_template(step_context)
        }
```

## 4. 비즈니스 로직 분석 및 조건부 흐름 생성

### 4.1 조건부 분기 자동 감지
**조건 표현 패턴 인식**:
```python
CONDITION_PATTERNS = {
    # 성공/실패 분기
    r".*성공.*시|.*완료.*시": "success_condition",
    r".*실패.*시|.*오류.*시|.*에러.*시": "failure_condition",
    
    # 사용자 선택 분기  
    r".*선택.*시|.*결정.*시": "user_choice_condition",
    r"\[.*\]|\(.*\)|.*중.*선택": "multiple_choice_condition",
    
    # 데이터 기반 분기
    r".*이상.*시|.*미만.*시|.*등급": "data_threshold_condition",
    r".*있는.*경우|.*없는.*경우": "existence_condition"
}
```

**LLM 기반 비즈니스 룰 분석**:
```python
class BusinessLogicAnalyzer:
    async def analyze_workflow_logic(self, parsed_steps: List[ParsedWorkflowStep]) -> WorkflowLogic:
        analysis_prompt = f"""
        다음 업무 단계들을 분석하여 필요한 조건부 분기와 에러 처리 로직을 제안해주세요:
        
        {self.format_steps_for_analysis(parsed_steps)}
        
        분석해야 할 사항:
        1. 어떤 단계에서 조건부 분기가 필요한가?
        2. 각 단계의 실패 시나리오와 대응 방안은?
        3. 사용자 개입이 필요한 지점은 어디인가?
        4. 데이터 검증이 필요한 지점은?
        5. 롤백이나 보상 트랜잭션이 필요한 작업은?
        
        응답을 다음 형식으로 제공해주세요:
        {{
            "conditional_branches": [...],
            "error_handling_points": [...], 
            "user_interaction_points": [...],
            "validation_requirements": [...],
            "rollback_scenarios": [...]
        }}
        """
        
        response = await self.llm_client.generate(analysis_prompt)
        return WorkflowLogic.parse_raw(response)
```

### 4.2 조건부 노드 및 엣지 생성
**Decision Router 노드 자동 생성**:
```python
def create_decision_router(self, condition_spec: ConditionSpec) -> dict:
    if condition_spec.type == "user_choice":
        return {
            "id": f"decide_{condition_spec.context}",
            "type": "decision_router", 
            "name": f"{condition_spec.context} 결정",
            "config": {
                "decision_logic": "user_choice_based",
                "choice_variable": f"state.{condition_spec.variable_name}"
            }
        }
    elif condition_spec.type == "api_result":
        return {
            "id": f"check_{condition_spec.context}",
            "type": "decision_router",
            "name": f"{condition_spec.context} 결과 확인", 
            "config": {
                "decision_logic": "api_result_check",
                "success_condition": condition_spec.success_expression
            }
        }
```

**조건부 엣지 생성**:
```python
def create_conditional_edges(self, decision_node_id: str, condition_spec: ConditionSpec) -> List[dict]:
    edges = []
    
    for outcome in condition_spec.possible_outcomes:
        edge = {
            "from": decision_node_id,
            "to": outcome.target_node,
            "condition": {
                "type": "expression",
                "expression": outcome.condition_expression
            }
        }
        edges.append(edge)
    
    return edges
```

### 4.3 에러 처리 및 복구 로직 추가
**에러 핸들러 노드 생성**:
```python
def create_error_handlers(self, workflow_logic: WorkflowLogic) -> List[dict]:
    error_handlers = []
    
    for error_point in workflow_logic.error_handling_points:
        handler = {
            "id": f"handle_error_{error_point.step_id}",
            "type": "error_handler",
            "name": f"{error_point.step_name} 에러 처리",
            "config": {
                "error_types": error_point.expected_errors,
                "recovery_strategy": error_point.recovery_strategy,
                "max_retries": error_point.max_retries,
                "fallback_action": error_point.fallback_action
            }
        }
        error_handlers.append(handler)
    
    return error_handlers
```

## 5. 완전한 JSON 워크플로우 생성

### 5.1 템플릿 조합 및 최종 생성
**워크플로우 조립기**:
```python
class WorkflowAssembler:
    def assemble_complete_workflow(self, 
                                 user_input: UserWorkflowInput,
                                 parsed_steps: List[ParsedWorkflowStep],
                                 tool_mappings: List[ToolMapping],
                                 workflow_logic: WorkflowLogic) -> dict:
        
        # 1. 기본 메타데이터 생성
        metadata = self.create_metadata(user_input)
        
        # 2. 모든 노드 생성 (기본 + 조건부 + 에러 처리)
        nodes = []
        nodes.extend(self.create_basic_nodes(parsed_steps, tool_mappings))
        nodes.extend(self.create_conditional_nodes(workflow_logic))
        nodes.extend(self.create_error_handling_nodes(workflow_logic))
        
        # 3. 모든 엣지 생성 (기본 흐름 + 조건부 분기)
        edges = []
        edges.extend(self.create_basic_edges(nodes))
        edges.extend(self.create_conditional_edges(workflow_logic))
        edges.extend(self.create_error_handling_edges(workflow_logic))
        
        # 4. 최종 JSON 워크플로우 조립
        workflow = {
            **metadata,
            "nodes": nodes,
            "edges": edges,
            "auto_generated": True,
            "generation_metadata": {
                "generated_at": datetime.utcnow().isoformat(),
                "source_format": "user_yaml",
                "generator_version": "1.0.0"
            }
        }
        
        # 5. 검증 및 최적화
        self.validate_workflow(workflow)
        self.optimize_workflow(workflow)
        
        return workflow
```

### 5.2 워크플로우 검증 및 최적화
**구조적 검증**:
```python
class WorkflowValidator:
    def validate_workflow(self, workflow: dict) -> ValidationResult:
        issues = []
        
        # 1. 필수 필드 검증
        required_fields = ["workflow_id", "nodes", "edges"]
        for field in required_fields:
            if field not in workflow:
                issues.append(f"Missing required field: {field}")
        
        # 2. 노드 참조 검증
        node_ids = {node["id"] for node in workflow["nodes"]}
        for edge in workflow["edges"]:
            if edge["from"] not in node_ids:
                issues.append(f"Edge references non-existent node: {edge['from']}")
            if edge["to"] not in node_ids:
                issues.append(f"Edge references non-existent node: {edge['to']}")
        
        # 3. 시작/종료 노드 검증
        start_nodes = [n for n in workflow["nodes"] if n["type"] == "workflow_start"]
        end_nodes = [n for n in workflow["nodes"] if n["type"] == "workflow_end"]
        
        if len(start_nodes) != 1:
            issues.append(f"Expected 1 start node, found {len(start_nodes)}")
        if len(end_nodes) == 0:
            issues.append("No end node found")
        
        # 4. 도달 가능성 검증
        reachable_nodes = self.find_reachable_nodes(workflow)
        unreachable = node_ids - reachable_nodes
        if unreachable:
            issues.append(f"Unreachable nodes: {unreachable}")
        
        return ValidationResult(valid=len(issues) == 0, issues=issues)
```

**성능 최적화**:
```python
class WorkflowOptimizer:
    def optimize_workflow(self, workflow: dict) -> dict:
        # 1. 병렬 실행 가능한 노드 식별
        parallel_opportunities = self.identify_parallel_nodes(workflow)
        
        # 2. 불필요한 조건 분기 제거
        workflow = self.remove_redundant_conditions(workflow)
        
        # 3. 캐시 가능한 노드 표시
        workflow = self.mark_cacheable_nodes(workflow)
        
        # 4. 배치 처리 가능한 호출 그룹화
        workflow = self.group_batchable_calls(workflow)
        
        return workflow
```

## 6. 사용자 검토 및 수정 인터페이스

### 6.1 변환 결과 미리보기
**시각적 워크플로우 표현**:
- 생성된 워크플로우를 플로우차트 형태로 시각화
- 각 노드의 역할과 연결 관계를 직관적으로 표시
- 조건부 분기와 에러 처리 경로를 색상으로 구분

**변환 과정 투명화**:
```json
{
  "translation_summary": {
    "original_steps": 8,
    "generated_nodes": 15,
    "added_logic": [
      "본인 인증 실패 시 재시도 로직",
      "고객 선택에 따른 분기 처리",
      "API 호출 에러 핸들링"
    ],
    "assumptions_made": [
      "고객 정보 조회 API 응답 형식 가정",
      "본인 인증 3회 실패 시 상담 종료"
    ],
    "confidence_scores": {
      "도구 매핑": 0.95,
      "비즈니스 로직": 0.87,
      "에러 처리": 0.82
    },
    "review_recommendations": [
      "5단계 고객 유인책 제시 로직 검토 필요",
      "해지 처리 API 파라미터 확인 필요"
    ]
  }
}
```

### 6.2 대화형 수정 인터페이스
**노드별 수정 지원**:
```python
class InteractiveWorkflowEditor:
    async def suggest_modifications(self, workflow: dict, user_feedback: str) -> List[Modification]:
        """사용자 피드백을 바탕으로 수정사항 제안"""
        
        modification_prompt = f"""
        사용자가 다음과 같은 피드백을 제공했습니다:
        "{user_feedback}"
        
        현재 워크플로우에서 수정이 필요한 부분을 분석하고 구체적인 수정사항을 제안해주세요:
        
        워크플로우 요약: {self.summarize_workflow(workflow)}
        
        제안 형식:
        {{
            "modifications": [
                {{
                    "type": "node_config_change|node_addition|edge_modification",
                    "target": "노드_ID_또는_엣지_ID",
                    "description": "수정 내용 설명",
                    "before": "현재 상태",
                    "after": "수정 후 상태",
                    "impact": "이 수정이 워크플로우에 미치는 영향"
                }}
            ],
            "validation_required": ["검증이 필요한 부분들"]
        }}
        """
        
        response = await self.llm_client.generate(modification_prompt)
        return ModificationSuggestions.parse_raw(response)
    
    def apply_modifications(self, workflow: dict, modifications: List[Modification]) -> dict:
        """제안된 수정사항을 워크플로우에 적용"""
        modified_workflow = deepcopy(workflow)
        
        for mod in modifications:
            if mod.type == "node_config_change":
                self.modify_node_config(modified_workflow, mod)
            elif mod.type == "node_addition":
                self.add_node(modified_workflow, mod)
            elif mod.type == "edge_modification":
                self.modify_edge(modified_workflow, mod)
        
        # 수정 후 재검증
        validation_result = self.validator.validate_workflow(modified_workflow)
        if not validation_result.valid:
            raise WorkflowValidationError(validation_result.issues)
        
        return modified_workflow
```

**실시간 영향도 분석**:
```python
class ImpactAnalyzer:
    def analyze_modification_impact(self, workflow: dict, modification: Modification) -> ImpactAnalysis:
        """수정사항이 워크플로우에 미치는 영향 분석"""
        
        impact = ImpactAnalysis()
        
        if modification.type == "node_addition":
            # 새 노드 추가가 실행 시간에 미치는 영향
            impact.execution_time_change = self.estimate_time_impact(modification)
            
            # 비용 영향 분석
            impact.cost_impact = self.estimate_cost_impact(modification)
            
            # 의존성 영향 분석
            impact.dependency_changes = self.analyze_dependency_impact(workflow, modification)
        
        elif modification.type == "edge_modification":
            # 흐름 변경이 로직에 미치는 영향
            impact.logic_changes = self.analyze_logic_impact(workflow, modification)
            
            # 도달 가능성 변화
            impact.reachability_changes = self.analyze_reachability_impact(workflow, modification)
        
        return impact
```

### 6.3 템플릿 저장 및 재사용
**워크플로우 템플릿 라이브러리**:
```python
class WorkflowTemplateManager:
    def save_as_template(self, workflow: dict, template_metadata: TemplateMetadata) -> str:
        """완성된 워크플로우를 재사용 가능한 템플릿으로 저장"""
        
        # 1. 사용자 특정 데이터 제거 및 파라미터화
        parameterized_workflow = self.parameterize_workflow(workflow)
        
        # 2. 템플릿 메타데이터 추가
        template = {
            "template_id": generate_template_id(),
            "name": template_metadata.name,
            "description": template_metadata.description,
            "category": template_metadata.category,
            "tags": template_metadata.tags,
            "author": template_metadata.author,
            "created_at": datetime.utcnow().isoformat(),
            "usage_count": 0,
            "rating": 0.0,
            "workflow": parameterized_workflow,
            "required_tools": self.extract_required_tools(workflow),
            "estimated_duration": self.estimate_duration(workflow),
            "complexity_level": self.assess_complexity(workflow)
        }
        
        # 3. 템플릿 저장
        template_id = self.template_repository.save(template)
        
        # 4. 검색 인덱스 업데이트
        self.search_indexer.index_template(template)
        
        return template_id
    
    def parameterize_workflow(self, workflow: dict) -> dict:
        """워크플로우를 파라미터화하여 재사용 가능하게 만듦"""
        parameterized = deepcopy(workflow)
        
        # 하드코딩된 값들을 파라미터로 변환
        parameters = {}
        
        for node in parameterized["nodes"]:
            if node["type"] == "mcp_tool_caller":
                # API 엔드포인트 파라미터화
                if "api_endpoint" in node["config"]:
                    param_name = f"{node['id']}_endpoint"
                    parameters[param_name] = {
                        "type": "string",
                        "description": f"{node['name']} API 엔드포인트",
                        "default": node["config"]["api_endpoint"]
                    }
                    node["config"]["api_endpoint"] = f"{{{{ {param_name} }}}}"
                    
            elif node["type"] == "llm_generation":
                # 프롬프트 템플릿 파라미터화
                if "system_prompt" in node["config"]:
                    param_name = f"{node['id']}_system_prompt"
                    parameters[param_name] = {
                        "type": "string", 
                        "description": f"{node['name']} 시스템 프롬프트",
                        "default": node["config"]["system_prompt"]
                    }
                    node["config"]["system_prompt"] = f"{{{{ {param_name} }}}}"
        
        # 파라미터 정의 추가
        parameterized["template_parameters"] = parameters
        
        return parameterized
```

## 7. 성능 최적화 및 캐싱 전략

### 7.1 변환 과정 최적화
**단계별 캐싱**:
```python
class TranslationCache:
    def __init__(self):
        self.parsing_cache = LRUCache(maxsize=1000)
        self.tool_mapping_cache = LRUCache(maxsize=500)
        self.logic_analysis_cache = LRUCache(maxsize=200)
    
    async def get_or_compute_parsing(self, user_input_hash: str, user_input: UserWorkflowInput) -> List[ParsedWorkflowStep]:
        if user_input_hash in self.parsing_cache:
            return self.parsing_cache[user_input_hash]
        
        parsed_steps = await self.parser.parse_user_input(user_input)
        self.parsing_cache[user_input_hash] = parsed_steps
        return parsed_steps
    
    async def get_or_compute_tool_mapping(self, step_hash: str, step: ParsedWorkflowStep) -> ToolMapping:
        if step_hash in self.tool_mapping_cache:
            return self.tool_mapping_cache[step_hash]
        
        mapping = await self.tool_mapper.map_step_to_tool(step)
        self.tool_mapping_cache[step_hash] = mapping
        return mapping
```

**배치 처리 지원**:
```python
class BatchTranslationProcessor:
    async def translate_multiple_workflows(self, user_inputs: List[UserWorkflowInput]) -> List[dict]:
        """여러 워크플로우를 배치로 처리하여 성능 최적화"""
        
        # 1. 입력들을 유사성에 따라 그룹핑
        grouped_inputs = self.group_similar_inputs(user_inputs)
        
        # 2. 그룹별로 공통 분석 수행
        results = []
        for group in grouped_inputs:
            # 공통 도구 매핑 및 패턴 분석
            common_patterns = await self.analyze_common_patterns(group)
            
            # 각 워크플로우 개별 처리 (공통 패턴 재사용)
            for user_input in group:
                workflow = await self.translate_with_patterns(user_input, common_patterns)
                results.append(workflow)
        
        return results
```

### 7.2 실시간 성능 모니터링
**변환 성능 메트릭**:
```python
class TranslationMetrics:
    def __init__(self):
        self.step_timings = defaultdict(list)
        self.cache_hit_rates = defaultdict(float)
        self.llm_token_usage = defaultdict(int)
        self.translation_success_rate = 0.0
    
    def record_translation_attempt(self, user_input: UserWorkflowInput, result: TranslationResult):
        # 단계별 소요 시간 기록
        for step, duration in result.step_timings.items():
            self.step_timings[step].append(duration)
        
        # 캐시 히트율 기록
        self.cache_hit_rates["parsing"] = result.parsing_cache_hit
        self.cache_hit_rates["tool_mapping"] = result.tool_mapping_cache_hit
        
        # LLM 토큰 사용량 기록
        self.llm_token_usage["total"] += result.total_tokens_used
        
        # 성공률 업데이트
        self.translation_success_rate = self.calculate_success_rate()
    
    def get_performance_report(self) -> dict:
        return {
            "average_translation_time": self.calculate_average_time(),
            "step_performance": {
                step: {
                    "avg_time": sum(times) / len(times),
                    "max_time": max(times),
                    "min_time": min(times)
                } for step, times in self.step_timings.items()
            },
            "cache_performance": dict(self.cache_hit_rates),
            "token_efficiency": self.llm_token_usage["total"] / len(self.step_timings.get("total", [1])),
            "success_rate": self.translation_success_rate
        }
```

## 8. 에러 처리 및 사용자 가이드

### 8.1 변환 실패 시나리오 처리
**공통 실패 패턴 및 대응**:
```python
class TranslationErrorHandler:
    def handle_translation_error(self, error: TranslationError, user_input: UserWorkflowInput) -> ErrorRecovery:
        if isinstance(error, AmbiguousStepError):
            # 애매한 단계 설명
            return ErrorRecovery(
                recovery_type="clarification_request",
                message="다음 단계의 설명이 애매합니다. 더 구체적으로 설명해주시겠어요?",
                suggestions=self.generate_clarification_suggestions(error.ambiguous_step),
                retry_possible=True
            )
            
        elif isinstance(error, UnsupportedToolError):
            # 지원하지 않는 도구
            return ErrorRecovery(
                recovery_type="alternative_suggestion",
                message=f"'{error.requested_tool}'은 현재 지원하지 않습니다.",
                suggestions=self.find_alternative_tools(error.requested_tool),
                retry_possible=True
            )
            
        elif isinstance(error, ComplexityTooHighError):
            # 너무 복잡한 워크플로우
            return ErrorRecovery(
                recovery_type="simplification_suggestion",
                message="워크플로우가 너무 복잡합니다. 더 작은 단위로 나누어 주시겠어요?",
                suggestions=self.suggest_workflow_breakdown(user_input),
                retry_possible=True
            )
        
        else:
            # 예상치 못한 에러
            return ErrorRecovery(
                recovery_type="fallback",
                message="변환 중 오류가 발생했습니다. 다시 시도해주세요.",
                retry_possible=True
            )
```

### 8.2 사용자 가이드 및 베스트 프랙티스
**효과적인 워크플로우 작성 가이드**:
```markdown
# 워크플로우 작성 베스트 프랙티스

## 1. 단계 설명 작성 요령
✅ **좋은 예시:**
- "고객 ID로 고객의 기본 정보와 계약 상태를 조회합니다"
- "SMS 인증을 통해 본인 확인을 진행합니다"

❌ **피해야 할 예시:**
- "고객 확인" (너무 모호함)
- "뭔가 처리" (구체적이지 않음)

## 2. 도구 지정 방법
✅ **명확한 도구 지정:**
- "고객 정보 조회 API"
- "AI 텍스트 생성"
- "파일 업로드 처리"

✅ **도구 힌트 제공:**
- tool: "고객 정보 조회 API"
- expected_input: "고객 ID 또는 전화번호"
- expected_output: "고객 기본 정보, 계약 상태"

## 3. 조건 및 분기 표현
✅ **명확한 조건 표현:**
- conditions: "인증 성공 시"
- user_choice: ["승인", "거부"]
- failure_action: "3회 실패 시 상담 종료"

## 4. 에러 처리 고려사항
✅ **예상 가능한 실패 시나리오:**
- "API 호출 실패 시 재시도"
- "사용자 입력 없음 시 기본값 사용"
- "권한 없음 시 관리자 승인 요청"
```

**템플릿 품질 평가 지표**:
```python
class TemplateQualityAssessor:
    def assess_workflow_quality(self, workflow: dict) -> QualityScore:
        score = QualityScore()
        
        # 1. 완성도 평가
        score.completeness = self.assess_completeness(workflow)
        
        # 2. 명확성 평가
        score.clarity = self.assess_clarity(workflow)
        
        # 3. 실행 가능성 평가
        score.executability = self.assess_executability(workflow)
        
        # 4. 최적화 정도 평가
        score.optimization = self.assess_optimization(workflow)
        
        # 5. 전체 점수 계산
        score.overall = (score.completeness + score.clarity + score.executability + score.optimization) / 4
        
        return score
    
    def generate_improvement_suggestions(self, workflow: dict, quality_score: QualityScore) -> List[str]:
        suggestions = []
        
        if quality_score.completeness < 0.8:
            suggestions.append("일부 단계의 에러 처리 로직이 부족합니다.")
        
        if quality_score.clarity < 0.7:
            suggestions.append("노드 이름과 설명을 더 명확하게 작성해주세요.")
        
        if quality_score.executability < 0.9:
            suggestions.append("일부 도구 매핑이 불완전합니다.")
        
        return suggestions
```

이 워크플로우 변환 시스템을 통해 사용자는 간단한 업무 설명만으로도 완전히 실행 가능한 AI 워크플로우를 생성할 수 있으며, 필요에 따라 세부사항을 조정하여 최적화된 자동화 솔루션을 구축할 수 있습니다.