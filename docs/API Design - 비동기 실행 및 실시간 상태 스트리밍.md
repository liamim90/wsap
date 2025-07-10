# Phase 3: API Design - 비동기 실행 및 실시간 상태 스트리밍

## 1. API 설계 전략 개요

### 1.1 비동기 실행 아키텍처 원칙
**핵심 설계 철학**: "Fire-and-Forget + Real-time Visibility"
- **즉시 응답**: 워크플로우 실행 요청 즉시 응답으로 실행 ID 반환
- **실시간 추적**: SSE를 통한 실행 과정 실시간 스트리밍  
- **상태 지속성**: 실행 상태를 영구 저장하여 연결 끊김 시에도 복구 가능
- **확장성**: 다중 서버 환경에서도 일관된 상태 추적

### 1.2 API 엔드포인트 설계 원칙
**RESTful + Event-Driven 하이브리드**:
- REST API: 리소스 관리 및 CRUD 작업
- SSE: 실시간 상태 업데이트 스트리밍
- WebSocket: 양방향 상호작용 (Human-in-the-Loop)

**버전 관리 및 하위 호환성**:
- API 버전: `/api/v1/` 경로 기반 버전 관리
- 스키마 진화: 필드 추가는 허용, 필드 제거는 새 버전
- 클라이언트 협상: Accept 헤더를 통한 응답 형식 선택

## 2. 워크플로우 실행 API 설계

### 2.1 워크플로우 실행 시작
**Endpoint**: `POST /api/v1/workflows/{workflow_id}/execute`

**요청 구조**:
```json
{
  "inputs": {
    "customer_id": "CUST001",
    "service_request": "상품 해지 요청",
    "priority": "normal"
  },
  "execution_options": {
    "timeout_seconds": 1800,
    "cost_limit_usd": 10.0,
    "notification_preferences": {
      "on_completion": true,
      "on_error": true,
      "on_user_input_required": true
    }
  },
  "context": {
    "user_session_id": "sess_12345",
    "source": "chat_interface",
    "correlation_id": "req_67890"
  }
}
```

**응답 구조** (202 Accepted):
```json
{
  "execution_id": "exec_uuid_12345",
  "status": "accepted",
  "estimated_duration_seconds": 900,
  "estimated_cost_usd": 3.50,
  "sse_endpoint": "/api/v1/executions/exec_uuid_12345/stream",
  "status_endpoint": "/api/v1/executions/exec_uuid_12345",
  "control_endpoint": "/api/v1/executions/exec_uuid_12345/control",
  "created_at": "2024-05-21T10:30:00Z"
}
```

### 2.2 실행 상태 조회
**Endpoint**: `GET /api/v1/executions/{execution_id}`

**응답 구조**:
```json
{
  "execution_id": "exec_uuid_12345",
  "workflow_id": "customer_service_cancellation",
  "status": "running",
  "current_step": {
    "node_id": "verify_identity",
    "node_name": "본인 인증 요청",
    "started_at": "2024-05-21T10:32:15Z",
    "estimated_remaining_seconds": 240
  },
  "progress": {
    "completed_steps": 2,
    "total_steps": 8,
    "percentage": 25.0
  },
  "resource_usage": {
    "tokens_used": 1250,
    "cost_accrued_usd": 1.85,
    "execution_time_seconds": 125
  },
  "started_at": "2024-05-21T10:30:00Z",
  "last_updated_at": "2024-05-21T10:32:15Z",
  "estimated_completion_at": "2024-05-21T10:45:00Z"
}
```

### 2.3 실행 제어
**Endpoint**: `POST /api/v1/executions/{execution_id}/control`

**지원되는 제어 명령**:
```json
{
  "action": "pause|resume|cancel|retry_step",
  "reason": "사용자 요청에 의한 일시 정지",
  "parameters": {
    "step_id": "verify_identity",
    "retry_count": 1
  }
}
```

**응답**:
```json
{
  "control_id": "ctrl_uuid_678",
  "action": "pause",
  "status": "accepted",
  "message": "워크플로우 실행이 일시 정지되었습니다.",
  "applied_at": "2024-05-21T10:35:00Z"
}
```

## 3. Server-Sent Events (SSE) 스트리밍 설계

### 3.1 SSE 엔드포인트 구조
**Endpoint**: `GET /api/v1/executions/{execution_id}/stream`

**연결 설정**:
```http
GET /api/v1/executions/exec_uuid_12345/stream HTTP/1.1
Host: api.workflowengine.com
Accept: text/event-stream
Cache-Control: no-cache
Authorization: Bearer jwt_token_here
Last-Event-ID: event_123  # 재연결 시 마지막 이벤트 ID
```

**SSE 응답 형식**:
```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: *

data: {"type":"connection_established","execution_id":"exec_uuid_12345","timestamp":"2024-05-21T10:30:00Z"}

id: event_001
event: workflow.started
data: {"execution_id":"exec_uuid_12345","workflow_id":"customer_service_cancellation","started_at":"2024-05-21T10:30:00Z"}

id: event_002  
event: step.started
data: {"execution_id":"exec_uuid_12345","step_id":"lookup_customer","step_name":"고객 식별 및 정보 조회","started_at":"2024-05-21T10:30:05Z"}

id: event_003
event: step.progress
data: {"execution_id":"exec_uuid_12345","step_id":"lookup_customer","progress_type":"api_call","message":"고객 정보 조회 API 호출 중..."}

id: event_004
event: step.completed
data: {"execution_id":"exec_uuid_12345","step_id":"lookup_customer","completed_at":"2024-05-21T10:30:12Z","duration_seconds":7,"output_summary":"고객 정보 조회 완료"}
```

### 3.2 이벤트 타입 및 페이로드 정의
**워크플로우 레벨 이벤트**:
```typescript
interface WorkflowEvent {
  execution_id: string;
  timestamp: string;
  
  // 워크플로우 시작
  'workflow.started': {
    workflow_id: string;
    estimated_duration_seconds: number;
  };
  
  // 워크플로우 완료
  'workflow.completed': {
    duration_seconds: number;
    final_result: any;
    resource_usage: ResourceUsage;
  };
  
  // 워크플로우 실패
  'workflow.failed': {
    error_type: string;
    error_message: string;
    failed_step: string;
    recovery_options: string[];
  };
  
  // 워크플로우 일시 정지
  'workflow.paused': {
    reason: string;
    paused_at_step: string;
    resume_instructions: string;
  };
}
```

**단계 레벨 이벤트**:
```typescript
interface StepEvent {
  execution_id: string;
  step_id: string;
  step_name: string;
  timestamp: string;
  
  // 단계 시작
  'step.started': {
    estimated_duration_seconds: number;
    input_data_summary: string;
  };
  
  // 단계 진행 상황
  'step.progress': {
    progress_type: 'api_call' | 'llm_generation' | 'data_processing' | 'user_interaction';
    message: string;
    percentage?: number;
    details?: any;
  };
  
  // 단계 완료
  'step.completed': {
    duration_seconds: number;
    output_data_summary: string;
    tokens_used?: number;
    cost_estimate?: number;
  };
  
  // 단계 실패
  'step.failed': {
    error_type: string;
    error_message: string;
    retry_count: number;
    will_retry: boolean;
  };
}
```

**사용자 상호작용 이벤트**:
```typescript
interface UserInteractionEvent {
  execution_id: string;
  step_id: string;
  timestamp: string;
  
  // 사용자 입력 요청
  'user.input_required': {
    interaction_type: 'choice' | 'text_input' | 'file_upload' | 'approval';
    prompt: string;
    options?: Array<{label: string, value: string}>;
    timeout_seconds?: number;
    input_schema?: any;
  };
  
  // 사용자 입력 수신
  'user.input_received': {
    input_data: any;
    received_at: string;
  };
  
  // 입력 타임아웃
  'user.input_timeout': {
    timeout_duration_seconds: number;
    default_action: string;
  };
}
```

### 3.3 연결 관리 및 재연결 처리
**연결 상태 관리**:
```python
class SSEConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, SSEConnection] = {}
        self.event_buffer: Dict[str, deque] = defaultdict(lambda: deque(maxlen=100))
        self.heartbeat_interval = 30  # seconds
    
    async def handle_connection(self, execution_id: str, request: Request) -> StreamingResponse:
        connection = SSEConnection(execution_id, request)
        self.active_connections[execution_id] = connection
        
        # Last-Event-ID 헤더 확인하여 누락된 이벤트 재전송
        last_event_id = request.headers.get("Last-Event-ID")
        if last_event_id:
            await self.replay_missed_events(connection, last_event_id)
        
        try:
            async for event in self.event_stream_generator(execution_id):
                yield event
        except asyncio.CancelledError:
            # 클라이언트 연결 끊김
            self.active_connections.pop(execution_id, None)
        except Exception as e:
            # 예상치 못한 오류
            await self.send_error_event(connection, str(e))
    
    async def replay_missed_events(self, connection: SSEConnection, last_event_id: str):
        """마지막 이벤트 ID 이후의 누락된 이벤트들을 재전송"""
        buffered_events = self.event_buffer[connection.execution_id]
        
        # last_event_id 이후의 이벤트들 찾기
        replay_start_index = None
        for i, event in enumerate(buffered_events):
            if event.id == last_event_id:
                replay_start_index = i + 1
                break
        
        if replay_start_index is not None:
            for event in list(buffered_events)[replay_start_index:]:
                await connection.send_event(event)
```

**하트비트 및 연결 유지**:
```python
async def heartbeat_manager(self):
    """주기적으로 하트비트 이벤트 전송하여 연결 유지"""
    while True:
        await asyncio.sleep(self.heartbeat_interval)
        
        for execution_id, connection in list(self.active_connections.items()):
            try:
                heartbeat_event = SSEEvent(
                    id=f"heartbeat_{int(time.time())}",
                    event="heartbeat",
                    data={"timestamp": datetime.utcnow().isoformat()}
                )
                await connection.send_event(heartbeat_event)
            except ConnectionClosed:
                # 연결이 끊어진 경우 정리
                self.active_connections.pop(execution_id, None)
```

## 4. Human-in-the-Loop WebSocket 통신

### 4.1 WebSocket 연결 설정
**Endpoint**: `WS /api/v1/executions/{execution_id}/interact`

**연결 설정 예시**:
```javascript
const wsUrl = `wss://api.workflowengine.com/api/v1/executions/${executionId}/interact`;
const socket = new WebSocket(wsUrl, [], {
    headers: {
        'Authorization': `Bearer ${jwtToken}`
    }
});

socket.onopen = (event) => {
    console.log('WebSocket 연결 성공');
    // 연결 확인 메시지 전송
    socket.send(JSON.stringify({
        type: 'connection_ack',
        execution_id: executionId,
        user_id: userId
    }));
};
```

### 4.2 상호작용 메시지 프로토콜
**클라이언트 → 서버 메시지**:
```typescript
interface ClientMessage {
  type: 'user_input' | 'control_command' | 'connection_ack';
  execution_id: string;
  timestamp: string;
  
  // 사용자 입력 응답
  user_input?: {
    step_id: string;
    interaction_id: string;
    input_data: any;
    response_time_ms: number;
  };
  
  // 제어 명령
  control_command?: {
    action: 'pause' | 'resume' | 'cancel';
    reason?: string;
  };
}
```

**서버 → 클라이언트 메시지**:
```typescript
interface ServerMessage {
  type: 'input_request' | 'input_confirmation' | 'error' | 'status_update';
  execution_id: string;
  timestamp: string;
  
  // 입력 요청
  input_request?: {
    step_id: string;
    interaction_id: string;
    prompt: string;
    input_type: 'choice' | 'text' | 'file' | 'approval';
    options?: Array<{label: string, value: any}>;
    validation_rules?: any;
    timeout_seconds?: number;
  };
  
  // 입력 확인
  input_confirmation?: {
    step_id: string;
    interaction_id: string;
    received_input: any;
    processing_status: 'accepted' | 'rejected' | 'validation_failed';
    next_action: string;
  };
  
  // 에러 정보
  error?: {
    error_code: string;
    error_message: string;
    recovery_suggestions: string[];
  };
}
```

### 4.3 상호작용 상태 관리
**상호작용 세션 추적**:
```python
@dataclass
class InteractionSession:
    execution_id: str
    step_id: str
    interaction_id: str
    user_id: str
    started_at: datetime
    timeout_at: Optional[datetime]
    status: Literal['pending', 'completed', 'timeout', 'cancelled']
    input_schema: dict
    received_input: Optional[any] = None
    response_time_ms: Optional[int] = None

class InteractionManager:
    def __init__(self):
        self.active_sessions: Dict[str, InteractionSession] = {}
        self.websocket_connections: Dict[str, WebSocket] = {}
    
    async def request_user_input(self, execution_id: str, step_id: str, input_request: dict) -> any:
        """사용자 입력 요청 및 응답 대기"""
        
        # 상호작용 세션 생성
        interaction_id = str(uuid4())
        session = InteractionSession(
            execution_id=execution_id,
            step_id=step_id,
            interaction_id=interaction_id,
            user_id=self.get_user_id_for_execution(execution_id),
            started_at=datetime.utcnow(),
            timeout_at=datetime.utcnow() + timedelta(seconds=input_request.get('timeout_seconds', 300)),
            status='pending',
            input_schema=input_request.get('validation_rules', {})
        )
        
        self.active_sessions[interaction_id] = session
        
        # WebSocket으로 입력 요청 전송
        websocket = self.websocket_connections.get(execution_id)
        if websocket:
            message = {
                'type': 'input_request',
                'execution_id': execution_id,
                'timestamp': datetime.utcnow().isoformat(),
                'input_request': {
                    'step_id': step_id,
                    'interaction_id': interaction_id,
                    **input_request
                }
            }
            await websocket.send_text(json.dumps(message))
        
        # 사용자 응답 또는 타임아웃 대기
        return await self.wait_for_user_response(interaction_id)
    
    async def wait_for_user_response(self, interaction_id: str) -> any:
        """사용자 응답 대기 (타임아웃 포함)"""
        session = self.active_sessions[interaction_id]
        
        while session.status == 'pending':
            if datetime.utcnow() > session.timeout_at:
                session.status = 'timeout'
                await self.handle_interaction_timeout(session)
                raise UserInputTimeoutError(f"User input timeout for interaction {interaction_id}")
            
            await asyncio.sleep(0.1)  # 100ms 간격으로 체크
        
        if session.status == 'completed':
            return session.received_input
        elif session.status == 'cancelled':
            raise UserInputCancelledError(f"User input cancelled for interaction {interaction_id}")
        else:
            raise UserInputError(f"Unexpected interaction status: {session.status}")
```

## 5. 에러 처리 및 복구 API

### 5.1 에러 상태 보고
**Endpoint**: `GET /api/v1/executions/{execution_id}/errors`

**응답 구조**:
```json
{
  "execution_id": "exec_uuid_12345",
  "error_summary": {
    "total_errors": 3,
    "critical_errors": 1,
    "warnings": 2,
    "last_error_at": "2024-05-21T10:35:22Z"
  },
  "errors": [
    {
      "error_id": "err_001",
      "step_id": "verify_identity",
      "error_type": "api_timeout",
      "error_code": "TIMEOUT_001",
      "error_message": "본인인증 API 응답 시간 초과",
      "occurred_at": "2024-05-21T10:35:22Z",
      "severity": "critical",
      "retry_count": 2,
      "max_retries": 3,
      "can_retry": true,
      "recovery_options": [
        {
          "action": "retry_step",
          "description": "단계 재시도",
          "estimated_success_rate": 0.8
        },
        {
          "action": "skip_step",
          "description": "본인인증 건너뛰기 (관리자 승인 필요)",
          "requires_approval": true
        },
        {
          "action": "cancel_workflow",
          "description": "워크플로우 취소",
          "final": true
        }
      ],
      "context": {
        "api_endpoint": "/auth/verify",
        "request_timeout": 30,
        "actual_duration": 35
      }
    }
  ]
}
```

### 5.2 복구 액션 실행
**Endpoint**: `POST /api/v1/executions/{execution_id}/recovery`

**요청 구조**:
```json
{
  "error_id": "err_001",
  "recovery_action": "retry_step",
  "parameters": {
    "timeout_seconds": 60,
    "retry_strategy": "exponential_backoff"
  },
  "reason": "API 서버 부하로 인한 일시적 지연으로 판단"
}
```

**응답**:
```json
{
  "recovery_id": "recovery_uuid_456",
  "status": "accepted",
  "action": "retry_step",
  "estimated_completion_time": "2024-05-21T10:38:00Z",
  "message": "본인인증 단계 재시도가 시작되었습니다."
}
```

### 5.3 실행 히스토리 및 감사 로그
**Endpoint**: `GET /api/v1/executions/{execution_id}/history`

**응답 구조**:
```json
{
  "execution_id": "exec_uuid_12345",
  "timeline": [
    {
      "timestamp": "2024-05-21T10:30:00Z",
      "event_type": "workflow_started",
      "description": "워크플로우 실행 시작",
      "details": {
        "workflow_id": "customer_service_cancellation",
        "triggered_by": "user_chat_request",
        "initial_inputs": {"customer_id": "CUST001"}
      }
    },
    {
      "timestamp": "2024-05-21T10:30:05Z",
      "event_type": "step_started",
      "description": "고객 정보 조회 시작",
      "details": {
        "step_id": "lookup_customer",
        "estimated_duration": 10
      }
    },
    {
      "timestamp": "2024-05-21T10:30:12Z",
      "event_type": "step_completed",
      "description": "고객 정보 조회 완료",
      "details": {
        "step_id": "lookup_customer",
        "actual_duration": 7,
        "tokens_used": 245,
        "cost_usd": 0.012
      }
    },
    {
      "timestamp": "2024-05-21T10:35:22Z",
      "event_type": "step_failed",
      "description": "본인인증 API 타임아웃",
      "details": {
        "step_id": "verify_identity",
        "error_code": "TIMEOUT_001",
        "retry_count": 2
      }
    },
    {
      "timestamp": "2024-05-21T10:36:15Z",
      "event_type": "user_intervention",
      "description": "사용자 복구 액션 실행",
      "details": {
        "recovery_action": "retry_step",
        "user_id": "user_789",
        "reason": "API 서버 부하로 인한 일시적 지연으로 판단"
      }
    }
  ],
  "summary": {
    "total_steps_attempted": 5,
    "steps_completed": 2,
    "steps_failed": 1,
    "steps_pending": 2,
    "total_execution_time": 375,
    "total_cost_usd": 1.85,
    "user_interventions": 1
  }
}
```

## 6. 성능 최적화 및 확장성

### 6.1 API 응답 시간 최적화
**응답 시간 목표**:
- 워크플로우 실행 시작: < 200ms
- 상태 조회: < 100ms  
- SSE 이벤트 전달: < 50ms
- WebSocket 메시지: < 30ms

**최적화 전략**:
```python
class APIPerformanceOptimizer:
    def __init__(self):
        self.response_cache = RedisCache(ttl=60)
        self.connection_pool = ConnectionPool(max_connections=100)
        self.rate_limiter = RateLimiter(requests_per_minute=1000)
    
    async def optimize_workflow_start(self, request: WorkflowExecutionRequest) -> dict:
        # 1. 입력 검증을 비동기로 처리
        validation_task = asyncio.create_task(self.validate_inputs(request))
        
        # 2. 워크플로우 템플릿 캐시에서 조회
        template = await self.template_cache.get(request.workflow_id)
        if not template:
            template = await self.load_template(request.workflow_id)
            await self.template_cache.set(request.workflow_id, template, ttl=3600)
        
        # 3. 실행 ID 생성 및 초기 상태 설정
        execution_id = str(uuid4())
        initial_state = self.create_initial_state(execution_id, request, template)
        
        # 4. 백그라운드에서 실행 시작
        asyncio.create_task(self.start_workflow_execution(execution_id, initial_state))
        
        # 5. 검증 완료 대기 (최대 100ms)
        await asyncio.wait_for(validation_task, timeout=0.1)
        
        return {
            "execution_id": execution_id,
            "status": "accepted",
            "sse_endpoint": f"/api/v1/executions/{execution_id}/stream"
        }
```

### 6.2 SSE 연결 확장성
**다중 서버 환경에서의 SSE 관리**:
```python
class DistributedSSEManager:
    def __init__(self):
        self.redis_client = redis.Redis(host='redis-cluster')
        self.server_id = socket.gethostname()
        self.local_connections: Dict[str, SSEConnection] = {}
    
    async def route_event_to_connection(self, execution_id: str, event: SSEEvent):
        # 1. 로컬 연결 확인
        if execution_id in self.local_connections:
            await self.local_connections[execution_id].send_event(event)
            return
        
        # 2. Redis를 통해 연결된 서버 찾기
        server_with_connection = await self.redis_client.get(f"sse_connection:{execution_id}")
        
        if server_with_connection:
            # 3. 다른 서버로 이벤트 전달
            await self.forward_event_to_server(server_with_connection, execution_id, event)
        else:
            # 4. 연결이 없는 경우 이벤트 버퍼링
            await self.buffer_event(execution_id, event)
    
    async def register_connection(self, execution_id: str, connection: SSEConnection):
        # 로컬 연결 등록
        self.local_connections[execution_id] = connection
        
        # Redis에 서버 매핑 등록
        await self.redis_client.setex(
            f"sse_connection:{execution_id}",
            3600,  # 1시간 TTL
            self.server_id
        )
```

### 6.3 부하 분산 및 리소스 관리
**워크플로우 실행 큐잉**:
```python
class WorkflowExecutionQueue:
    def __init__(self):
        self.celery_app = Celery('workflow_engine')
        self.priority_queue = PriorityQueue()
        self.execution_semaphore = asyncio.Semaphore(50)  # 최대 50개 동시 실행
    
    async def enqueue_workflow(self, execution_request: WorkflowExecutionRequest) -> str:
        # 1. 우선순위 계산
        priority = self.calculate_priority(execution_request)
        
        # 2. 리소스 사용량 예측
        estimated_resources = self.estimate_resource_usage(execution_request)
        
        # 3. 큐에 추가
        execution_id = str(uuid4())
        await self.priority_queue.put({
            'execution_id': execution_id,
            'request': execution_request,
            'priority': priority,
            'estimated_resources': estimated_resources,
            'queued_at': datetime.utcnow()
        })
        
        # 4. 백그라운드 처리 시작
        asyncio.create_task(self.process_queue())
        
        return execution_id
    
    async def process_queue(self):
        """큐에서 워크플로우를 순차적으로 처리"""
        while True:
            try:
                # 세마포어로 동시 실행 수 제한
                async with self.execution_semaphore:
                    queue_item = await self.priority_queue.get()
                    
                    # Celery 태스크로 실행
                    self.celery_app.send_task(
                        'workflow_engine.execute_workflow',
                        args=[queue_item['execution_id'], queue_item['request']],
                        priority=queue_item['priority']
                    )
                    
            except Exception as e:
                logger.error(f"Queue processing error: {e}")
                await asyncio.sleep(1)
```

## 7. API 보안 및 인증

### 7.1 인증 및 권한 관리
**JWT 기반 인증**:
```python
class WorkflowAPIAuth:
    def __init__(self):
        self.jwt_secret = os.getenv('JWT_SECRET')
        self.token_expiry = timedelta(hours=24)
    
    async def authenticate_request(self, request: Request) -> User:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPException(401, "Missing or invalid authorization header")
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            # 사용자 권한 확인
            user = await self.get_user_with_permissions(user_id)
            return user
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(401, "Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(401, "Invalid token")
    
    async def check_workflow_access(self, user: User, workflow_id: str) -> bool:
        """사용자가 특정 워크플로우에 접근할 수 있는지 확인"""
        workflow_permissions = await self.get_workflow_permissions(workflow_id)
        return any(perm in user.permissions for perm in workflow_permissions.required_permissions)
```

### 7.2 API 레이트 리미팅
```python
class APIRateLimiter:
    def __init__(self):
        self.redis_client = redis.Redis()
        self.rate_limits = {
            'workflow_execution': (10, 3600),  # 10회/시간
            'status_check': (100, 60),  # 100회/분
            'sse_connection': (5, 300)  # 5개 연결/5분
        }
    
    async def check_rate_limit(self, user_id: str, endpoint_type: str) -> bool:
        if endpoint_type not in self.rate_limits:
            return True
        
        limit, window = self.rate_limits[endpoint_type]
        key = f"rate_limit:{user_id}:{endpoint_type}"
        
        current_count = await self.redis_client.get(key)
        if current_count and int(current_count) >= limit:
            return False
        
        # 카운터 증가
        pipe = self.redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        await pipe.execute()
        
        return True
```

이 API 설계를 통해 워크플로우 실행의 전체 생명주기를 효과적으로 관리하고, 사용자에게 실시간으로 투명한 실행 과정을 제공할 수 있습니다.