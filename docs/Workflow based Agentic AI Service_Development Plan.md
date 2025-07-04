# **TDD 기반 Development Plan: 절차 기반 Agentic AI 서비스 (MVP)**

## **1. TDD 전략 개요**

### **1.1 TDD 목표**
- **외부 의존성 격리**: LLM API, 외부 서비스와의 독립적 테스트
- **단계별 검증**: 각 개발 단계 완료 기준을 테스트로 명확히 정의
- **빠른 피드백**: 각 단계별 핵심 기능 동작 여부를 즉시 확인
- **문서화 효과**: 테스트 코드가 API 명세서 및 요구사항 정의 역할

### **1.2 TDD 사이클 정의 및 핵심 원칙**

#### **TDD 사이클**
```
🔴 RED: 실패하는 테스트 작성 (다음 단계 기능 명세 정의)
    ↓
🟢 GREEN: 최소한의 코드로 테스트 통과 (해당 단계 기능 구현)
    ↓
🔵 REFACTOR: 코드 품질 개선 (다음 단계 준비)
    ↓
✅ COMMIT: 완전한 TDD 사이클 완료 후 소스코드 반영
    ↓
다음 단계로 이동
```

#### **핵심 원칙: Refactor-Complete Rule**
```
🚫 절대 금지: 
   - GREEN 단계에서 임시/더러운 코드를 메인 브랜치에 커밋
   - REFACTOR 과정을 건너뛰고 다음 기능 개발
   - 테스트는 통과하지만 코드 품질이 떨어지는 상태로 방치

✅ 필수 준수:
   - RED → GREEN → REFACTOR 전체 사이클 완료 후에만 커밋
   - 각 커밋은 "기능 완성 + 코드 품질 확보" 상태여야 함
   - 리팩터링 후 모든 테스트가 여전히 통과하는지 확인
   - 다음 개발자가 보기에 부끄럽지 않은 코드 상태 유지
```

#### **실행 방법**
```bash
# 작업 브랜치에서 TDD 사이클 진행
git checkout -b feature/auth-system

# RED: 실패하는 테스트 작성
git add tests/test_user_auth.py
git commit -m "RED: Add failing test for user signup validation"

# GREEN: 최소 구현 (로컬에서만, 커밋하지 않음)
# 테스트 통과 확인 후...

# REFACTOR: 코드 품질 개선 (로컬에서만)
# 모든 테스트 재실행 및 통과 확인 후...

# 완전한 사이클 완료 후 최종 커밋
git add src/auth/ tests/test_user_auth.py
git commit -m "COMPLETE: Implement user signup with validation and refactoring"

# 메인 브랜치에 머지
git checkout main
git merge feature/auth-system
```

---

## **Phase 1: 백엔드 코어 인프라 및 인증/보안 시스템 구축 (Week 1-2)**

*   **목표:** 서비스의 안정적인 기반을 다지고, 사용자가 시스템과 안전하게 상호작용할 수 있는 보안 체계를 완성한다.

### **1.1. 초기 환경 구성 및 인프라 설정**

#### **완료 기준 (Definition of Done)**
- [O] `docker-compose up` 명령어로 모든 서비스가 정상 실행
- [O] `/health` 엔드포인트가 200 OK를 반환
- [ ] CI 파이프라인이 PR 생성 시 자동으로 테스트 실행
- [O] **Refactor-Complete Rule 준수**: 모든 설정 파일이 리팩터링 완료 상태

#### **핵심 테스트 시나리오**
```
✅ T1.1.1: 헬스체크 엔드포인트 정상 동작 [O]
   - 입력: GET /health
   - 검증: 200 응답 + {"status": "healthy"} 반환

✅ T1.1.2: 데이터베이스 연결 확인 [O]
   - 입력: DB 연결 테스트
   - 검증: 연결 성공 및 기본 쿼리 실행

✅ T1.1.3: Docker 컨테이너 상태 확인 [O]
   - 입력: docker-compose up
   - 검증: 모든 서비스 healthy 상태
```

#### **개발 태스크**
*   [O] **Task 1.1.1 (TDD):** 프로젝트 디렉토리 및 `src` 폴더 구조 생성
*   [O] **Task 1.1.2 (TDD):** `docker-compose.yml` 파일 작성 (FastAPI, Postgres, Qdrant, Redis, Celery)
*   [O] **Task 1.1.3 (TDD):** `Dockerfile` 작성 및 컨테이너 빌드 확인
*   [O] **Task 1.1.4 (TDD):** `pytest` 및 `Alembic` 설정 완료
*   [ ] **Task 1.1.5 (TDD):** GitHub Actions CI 워크플로우 초기 설정

### **1.2. DB 모델링 및 사용자 인증 시스템**

#### **완료 기준 (Definition of Done)**
- [O] 사용자가 API를 통해 회원가입, 로그인 가능
- [O] JWT 토큰으로 보호된 API에 접근 가능
- [O] API 키가 Secrets Manager를 통해 안전하게 관리
- [O] 입력 검증 및 적절한 예외 처리 동작

#### **핵심 테스트 시나리오**
```
✅ T1.2.1: 사용자 회원가입 성공
   - 입력: 유효한 이메일 + 비밀번호
   - 검증: 201 응답 + 사용자 생성 + 비밀번호 해싱

✅ T1.2.2: 중복 이메일 회원가입 실패
   - 입력: 이미 존재하는 이메일
   - 검증: 400 응답 + 적절한 에러 메시지

✅ T1.2.3: 사용자 로그인 성공
   - 입력: 올바른 이메일 + 비밀번호
   - 검증: 200 응답 + JWT 토큰 반환

✅ T1.2.4: JWT 토큰 인증 확인
   - 입력: 유효한 JWT 토큰
   - 검증: 보호된 엔드포인트 접근 성공

✅ T1.2.5: API 키 CRUD 동작
   - 입력: 인증된 사용자의 API 키 관리 요청
   - 검증: 생성/조회/삭제 정상 동작
```

#### **개발 태스크**
*   [O] **Task 1.2.1 (TDD):** SQLAlchemy 비동기 DB 세션 설정 (`database.py`)
*   [O] **Task 1.2.2 (TDD):** `User` 모델 정의 및 Alembic 마이그레이션 (`models/user.py`)
*   [O] **Task 1.2.3 (TDD):** 사용자 회원가입 API (`/auth/signup`) 구현
*   [O] **Task 1.2.4 (TDD):** 사용자 로그인 및 JWT 토큰 발급/검증 API (`/auth/login`) 구현
*   [O] **Task 1.2.5 (TDD):** `SecretsService` 구현 (로컬에서는 Mock)
*   [O] **Task 1.2.6 (TDD):** `/users/me` 및 `/users/me/api-keys` CRUD API 구현

#### **Mock/Stub 전략**
- **Secrets Manager**: MockSecretsManager로 로컬 개발 지원
- **외부 의존성**: 없음 (순수 인증 로직만 테스트)

---

## **Phase 2: 프론트엔드 디자인 시스템 및 기본 구조 구축 (Week 2-3)**

*   **목표:** 백엔드 개발과 병행하여 프론트엔드의 기반을 마련하고, 재사용 가능한 컴포넌트 시스템을 구축한다.

### **2.1. 프로젝트 초기 설정 및 디자인 시스템 토큰 정의**

#### **완료 기준 (Definition of Done)**
- [O] 프로젝트가 정상적으로 실행
- [O] 디자인 토큰이 Tailwind CSS에 적용되어 일관된 스타일링 가능
- [O] Storybook 기본 설정 완료
- [O] **Refactor-Complete Rule 준수**: 모든 설정 파일이 최적화된 상태

#### **핵심 테스트 시나리오**
```
✅ T2.1.1: 프로젝트 빌드 성공 [O]
   - 입력: npm run build
   - 검증: 에러 없이 빌드 완료

✅ T2.1.2: 디자인 토큰 적용 확인 [O]
   - 입력: Tailwind 클래스 사용
   - 검증: 설정된 컬러/타이포그래피 정상 적용

✅ T2.1.3: Storybook 실행 확인 [O]
   - 입력: npm run storybook
   - 검증: Storybook 정상 실행 및 컴포넌트 표시
```

#### **개발 태스크**
*   [O] **Task 2.1.1 (TDD):** React + TypeScript + Vite + Tailwind CSS 프로젝트 초기 설정
*   [O] **Task 2.1.2 (TDD):** 폴더 구조 생성 및 기본 파일 구성
*   [O] **Task 2.1.3 (TDD):** ESLint, Prettier, Husky 설정
*   [O] **Task 2.1.4 (TDD):** 디자인 토큰 정의 (`constants/design-tokens.ts`)
*   [O] **Task 2.1.5 (TDD):** Tailwind CSS 설정 커스터마이징
*   [O] **Task 2.1.6 (TDD):** Storybook 설정 및 기본 구성

### **2.2. 기본 UI 컴포넌트 라이브러리 구축**

#### **완료 기준 (Definition of Done)**
- [O] 모든 기본 UI 컴포넌트가 다양한 variant, size, state 지원
- [O] Storybook과 Jest 테스트 통과
- [O] 접근성 기본 요구사항 충족
- [O] **Refactor-Complete Rule 준수**: 재사용 가능하고 유지보수 용이한 코드

#### **핵심 테스트 시나리오**
```
✅ T2.2.1: Typography 컴포넌트 렌더링 [O]
   - 입력: <Typography variant="h1">Title</Typography>
   - 검증: 올바른 HTML 태그 및 스타일 적용

✅ T2.2.2: Button 상호작용 테스트 [O]
   - 입력: 버튼 클릭 이벤트
   - 검증: onClick 핸들러 정상 호출

✅ T2.2.3: Input 유효성 검사 [O]
   - 입력: 잘못된 형식의 데이터
   - 검증: 에러 상태 표시 및 메시지 출력

✅ T2.2.4: Modal 접근성 테스트 [O]
   - 입력: 키보드 네비게이션 (Tab, Escape)
   - 검증: Focus trap 및 적절한 ARIA 속성
```

#### **개발 태스크**
*   [O] **Task 2.2.1 (TDD):** Typography 컴포넌트 구현
```typescript
// tests/components/ui/Typography.test.tsx
describe('Typography', () => {
  it('renders different variants correctly', () => {
    render(<Typography variant="h1">Title</Typography>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
  
  it('applies custom className', () => {
    render(<Typography className="custom-class">Text</Typography>);
    expect(screen.getByText('Text')).toHaveClass('custom-class');
  });
});
```
*   [O] **Task 2.2.2 (TDD):** Button 컴포넌트 구현 (primary, secondary, outline, ghost variants)
*   [O] **Task 2.2.3 (TDD):** Input 컴포넌트 구현 (validation states 포함)
*   [O] **Task 2.2.4 (TDD):** Card 컴포넌트 구현
*   [O] **Task 2.2.5 (TDD):** Modal 컴포넌트 구현 (focus trap, escape key, backdrop click)
*   [O] **Task 2.2.6 (TDD):** Loading/Spinner 컴포넌트 구현
*   [O] **Task 2.2.7:** Storybook stories 작성 (각 컴포넌트별 모든 variants)

### **2.3. 레이아웃 및 네비게이션 시스템 구축**

#### **완료 기준 (Definition of Done)**
- [ ] 반응형 레이아웃이 정상 작동
- [ ] 인증 상태에 따른 네비게이션이 올바르게 렌더링
- [ ] 모바일 메뉴가 정상 동작
- [ ] 라우팅 보호 기능 작동

#### **핵심 테스트 시나리오**
```
✅ T2.3.1: Header 인증 상태별 렌더링
   - 입력: 인증/비인증 상태
   - 검증: 적절한 메뉴 및 버튼 표시

✅ T2.3.2: Sidebar 접기/펼치기 동작
   - 입력: 토글 버튼 클릭
   - 검증: 사이드바 상태 변경 및 애니메이션

✅ T2.3.3: 반응형 네비게이션
   - 입력: 화면 크기 변경
   - 검증: 모바일/데스크톱 메뉴 적절히 전환

✅ T2.3.4: 보호된 라우트 테스트
   - 입력: 비인증 사용자의 보호된 페이지 접근
   - 검증: 로그인 페이지로 리다이렉트
```

#### **개발 태스크**
*   [ ] **Task 2.3.1 (TDD):** React Router DOM 설정 및 라우팅 구조 정의
*   [ ] **Task 2.3.2 (TDD):** Header 컴포넌트 구현
```typescript
// tests/components/layout/Header.test.tsx
describe('Header', () => {
  it('shows login button when user is not authenticated', () => {
    render(<Header isAuthenticated={false} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  
  it('shows user menu when authenticated', () => {
    render(<Header isAuthenticated={true} user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
});
```
*   [ ] **Task 2.3.3 (TDD):** Sidebar 컴포넌트 구현
*   [ ] **Task 2.3.4 (TDD):** MainLayout 컴포넌트 구현
*   [ ] **Task 2.3.5 (TDD):** 반응형 네비게이션 구현

### **2.4. 상태 관리 및 API 통신 설정**

#### **완료 기준 (Definition of Done)**
- [ ] 인증 상태가 전역적으로 관리
- [ ] API 통신 시 적절한 에러 처리와 로딩 상태 제공
- [ ] 토큰 자동 갱신 기능 동작
- [ ] 커스텀 훅으로 재사용성 확보

#### **핵심 테스트 시나리오**
```
✅ T2.4.1: 인증 상태 관리
   - 입력: 로그인/로그아웃 액션
   - 검증: 전역 상태 업데이트 및 localStorage 동기화

✅ T2.4.2: API 인터셉터 동작
   - 입력: 401 에러 응답
   - 검증: 자동 로그아웃 및 로그인 페이지 리다이렉트

✅ T2.4.3: 커스텀 훅 동작
   - 입력: useAuth 훅 사용
   - 검증: 로그인 상태 및 관련 함수 제공
```

#### **개발 태스크**
*   [ ] **Task 2.4.1 (TDD):** Zustand 상태 관리 설정
*   [ ] **Task 2.4.2 (TDD):** Axios 인스턴스 설정 (인터셉터, 에러 처리)
*   [ ] **Task 2.4.3 (TDD):** API 서비스 함수들 구현 (`services/api/`)
*   [ ] **Task 2.4.4 (TDD):** 커스텀 훅 구현 (`useAuth`, `useApi`, `useLocalStorage`)
```typescript
// tests/hooks/useAuth.test.tsx
describe('useAuth', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login(mockCredentials);
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
  
  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth());
    mockAPI.onPost('/auth/login').reply(401, { message: 'Invalid credentials' });
    
    await act(async () => {
      try {
        await result.current.login(mockCredentials);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

#### **Mock/Stub 전략**
- **API Calls**: axios-mock-adapter로 HTTP 요청 시뮬레이션
- **LocalStorage**: jest-localstorage-mock 사용
- **Router**: MemoryRouter로 라우팅 테스트

---

## **Phase 3: 워크플로우 실행 엔진 및 RAG 파이프라인 구축 (Week 3-4)**

*   **목표:** 서비스의 핵심 가치인 '절차 기반 실행' 엔진을 완성하고, 지식 기반(RAG)을 제공하기 위한 데이터 처리 파이프라인을 구축한다.

### **3.1. Agent Core 및 워크플로우 실행 엔진**

#### **완료 기준 (Definition of Done)**
- [ ] LangGraph로 정의된 워크플로우를 API를 통해 실행 가능
- [ ] 워크플로우 결과를 JSON 형태로 반환
- [ ] 다양한 워크플로우 템플릿 지원
- [ ] 실행 상태 추적 가능

#### **핵심 테스트 시나리오**
```
✅ T3.1.1: 워크플로우 상태 객체 검증
   - 입력: 워크플로우 초기 상태
   - 검증: AgentState 객체 올바른 구조 및 타입

✅ T3.1.2: 워크플로우 실행 성공
   - Mock: LLM API 정상 응답
   - 검증: 워크플로우 완료 및 결과 반환

✅ T3.1.3: 워크플로우 템플릿 로딩
   - 입력: JSON 워크플로우 템플릿 파일
   - 검증: 템플릿 파싱 및 LangGraph 구성

✅ T3.1.4: 워크플로우 실행 API
   - 입력: POST /workflows/{workflow_id}/execute
   - 검증: 202 응답 + 실행 ID 반환
```

#### **개발 태스크**
*   [ ] **Task 3.1.1 (TDD):** 워크플로우 상태 객체 `AgentState` Pydantic 모델 정의
*   [ ] **Task 3.1.2 (TDD):** LangGraph `StatefulGraph`를 구성하고 실행하는 `WorkflowService` 구현
*   [ ] **Task 3.1.3 (TDD):** JSON 파일로 정의된 워크플로우 템플릿 로드 로직 구현
*   [ ] **Task 3.1.4 (TDD):** 워크플로우 실행 API (`/workflows/{workflow_id}/execute`) 구현

### **3.2. RAG 데이터 처리 파이프라인**

#### **완료 기준 (Definition of Done)**
- [ ] 파일 업로드 시 백그라운드에서 비동기 처리
- [ ] Qdrant와 PostgreSQL에 데이터 저장
- [ ] 다양한 파일 형식 지원 (PDF, TXT, DOCX 등)
- [ ] 처리 상태 추적 가능

#### **핵심 테스트 시나리오**
```
✅ T3.2.1: 파일 파싱 성공
   - 입력: PDF, TXT, DOCX 파일
   - 검증: 텍스트 추출 및 메타데이터 저장

✅ T3.2.2: 텍스트 청킹 정확성
   - 입력: 긴 텍스트 문서
   - 검증: 적절한 크기로 분할 및 오버랩 유지

✅ T3.2.3: 파일 업로드 API
   - 입력: POST /rag/upload (multipart/form-data)
   - 검증: 202 응답 + 처리 작업 ID 반환

✅ T3.2.4: 비동기 처리 파이프라인
   - Mock: Celery 태스크 실행
   - 검증: 파싱 → 청킹 → 임베딩 → 저장 순차 실행
```

#### **개발 태스크**
*   [ ] **Task 3.2.1 (TDD):** `File` 및 `Chunk` DB 모델 정의 및 마이그레이션
*   [ ] **Task 3.2.2 (TDD):** 파일 유형별 텍스트 파서 서비스 (`services/parser.py`)
*   [ ] **Task 3.2.3 (TDD):** `RecursiveCharacterTextSplitter`를 사용한 청킹 서비스
*   [ ] **Task 3.2.4 (TDD):** 파일 업로드 API (`/rag/upload`) 구현
*   [ ] **Task 3.2.5 (TDD):** Celery 비동기 처리 태스크 구현

### **3.3. RAG 검색 기능 및 워크플로우 통합**

#### **완료 기준 (Definition of Done)**
- [ ] '문서 기반 Q&A' 워크플로우가 RAG 검색 도구를 성공적으로 호출
- [ ] 검색된 컨텍스트를 기반으로 LLM이 답변 생성
- [ ] 하이브리드 검색 (키워드 + 벡터) 지원
- [ ] Re-ranking을 통한 검색 품질 향상

#### **핵심 테스트 시나리오**
```
✅ T3.3.1: RAG 하이브리드 검색
   - 입력: 사용자 질문
   - 검증: Qdrant에서 관련 문서 청크 반환

✅ T3.3.2: Re-ranking 동작
   - 입력: 검색된 문서 청크들
   - 검증: 관련도 순으로 재정렬

✅ T3.3.3: RAG 도구 워크플로우 통합
   - 입력: 문서 기반 질문
   - 검증: 검색 → 컨텍스트 구성 → LLM 답변 생성
```

#### **개발 태스크**
*   [ ] **Task 3.3.1 (TDD):** Qdrant 하이브리드 검색 및 Re-ranker 통합한 `RetrievalService` 구현
*   [ ] **Task 3.3.2 (TDD):** `RetrievalService`를 LangChain `Tool`로 래핑
*   [ ] **Task 3.3.3 (TDD):** `RAGSearchTool`을 사용하는 워크플로우 노드 및 그래프 구성

#### **Mock/Stub 전략**
- **LLM API**: openai.OpenAI Mock으로 고정 응답 반환
- **Qdrant**: 메모리 내 벡터 스토어 또는 Mock 객체
- **Celery**: apply_async() Mock으로 태스크 시뮬레이션

---

## **Phase 4: 인증 및 파일 업로드 UI 구현 (Week 4-5)**

*   **목표:** 사용자가 UI를 통해 인증하고 파일을 업로드할 수 있는 완전한 기능을 제공한다.

### **4.1. 인증 페이지 및 보호된 라우팅 구현**

#### **완료 기준 (Definition of Done)**
- [ ] 사용자가 UI를 통해 회원가입/로그인 가능
- [ ] 로그인된 상태가 새로고침 후에도 유지
- [ ] 보호된 페이지에 적절한 접근 제어
- [ ] 폼 유효성 검사 및 사용자 친화적 에러 처리

#### **핵심 테스트 시나리오**
```
✅ T4.1.1: 로그인 폼 제출 성공
   - 입력: 유효한 이메일 + 비밀번호
   - 검증: API 호출 + 성공 메시지 + 리다이렉트

✅ T4.1.2: 로그인 실패 처리
   - Mock: 401 API 응답
   - 검증: 에러 메시지 표시 + 폼 상태 유지

✅ T4.1.3: 보호된 라우트 접근 제어
   - 입력: 비인증 사용자의 대시보드 접근
   - 검증: 로그인 페이지로 리다이렉트

✅ T4.1.4: 폼 유효성 검사
   - 입력: 잘못된 이메일 형식
   - 검증: 실시간 에러 메시지 표시 + 제출 버튼 비활성화

✅ T4.1.5: 회원가입 폼 동작
   - 입력: 신규 사용자 정보
   - 검증: 계정 생성 + 자동 로그인 + 대시보드 이동
```

#### **개발 태스크**
*   [ ] **Task 4.1.1 (TDD):** 로그인 페이지 컴포넌트 구현
```typescript
// tests/pages/Login.test.tsx
describe('Login Page', () => {
  it('should submit login form with valid credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });
  
  it('should display error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    render(<Login />);
    // ... form submission
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```
*   [ ] **Task 4.1.2 (TDD):** 회원가입 페이지 컴포넌트 구현
*   [ ] **Task 4.1.3 (TDD):** 폼 유효성 검사 및 에러 처리 구현 (react-hook-form + zod)
*   [ ] **Task 4.1.4 (TDD):** ProtectedRoute 컴포넌트 구현
*   [ ] **Task 4.1.5 (TDD):** 사용자 프로필 페이지 및 API 키 관리 UI 구현

### **4.2. 파일 업로드 시스템 구현**

#### **완료 기준 (Definition of Done)**
- [ ] 드래그앤드롭 또는 클릭으로 파일 업로드 가능
- [ ] 업로드 진행상황과 결과를 실시간으로 확인 가능
- [ ] 지원하는 파일 타입 검증
- [ ] 파일 처리 상태 실시간 업데이트

#### **핵심 테스트 시나리오**
```
✅ T4.2.1: 파일 드래그앤드롭 업로드
   - 입력: PDF 파일 드래그앤드롭
   - 검증: 파일 선택 + 업로드 프로세스 시작

✅ T4.2.2: 파일 타입 검증
   - 입력: 지원하지 않는 파일 형식
   - 검증: 에러 메시지 표시 + 업로드 차단

✅ T4.2.3: 업로드 진행률 표시
   - Mock: 업로드 진행 이벤트
   - 검증: 프로그레스 바 업데이트 + 퍼센트 표시

✅ T4.2.4: 파일 처리 상태 추적
   - Mock: SSE 또는 WebSocket 상태 업데이트
   - 검증: "파싱 중" → "임베딩 중" → "완료" 상태 표시
```

#### **개발 태스크**
*   [ ] **Task 4.2.1 (TDD):** FileUpload 컴포넌트 구현
```typescript
// tests/components/FileUpload.test.tsx
describe('FileUpload', () => {
  it('should accept valid file types', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    render(<FileUpload acceptedTypes={['pdf', 'txt']} onUpload={mockOnUpload} />);
    
    const input = screen.getByLabelText('File upload');
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnUpload).toHaveBeenCalledWith([file]);
  });
  
  it('should reject invalid file types', () => {
    const file = new File(['content'], 'test.exe', { type: 'application/exe' });
    render(<FileUpload acceptedTypes={['pdf', 'txt']} onUpload={mockOnUpload} />);
    
    const input = screen.getByLabelText('File upload');
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('File type not supported')).toBeInTheDocument();
    expect(mockOnUpload).not.toHaveBeenCalled();
  });
});
```
*   [ ] **Task 4.2.2 (TDD):** 파일 업로드 진행상황 및 상태 표시 컴포넌트 구현
*   [ ] **Task 4.2.3 (TDD):** 업로드된 파일 목록 및 관리 UI 구현
*   [ ] **Task 4.2.4 (TDD):** 파일 처리 상태 실시간 업데이트 (WebSocket 또는 SSE)

#### **Mock/Stub 전략**
- **File Upload API**: XMLHttpRequest Mock으로 업로드 진행률 시뮬레이션
- **WebSocket**: Mock WebSocket 객체로 상태 업데이트 시뮬레이션
- **File API**: File, FileReader Mock 객체 활용

---

## **Phase 5: 채팅 인터페이스 및 워크플로우 실행 UI (Week 5-6)**

*   **목표:** 사용자가 AI와 자연스럽게 대화하며 워크플로우를 실행할 수 있는 완전한 채팅 인터페이스를 제공한다.

### **5.1. 채팅 UI 컴포넌트 구축**

#### **완료 기준 (Definition of Done)**
- [ ] 사용자와 AI 간의 메시지 교환이 실시간으로 이루어짐
- [ ] 다양한 메시지 타입 지원 (텍스트, 파일, 워크플로우 결과)
- [ ] 채팅 히스토리 저장 및 로드
- [ ] 메시지 상태 표시 (전송 중, 전송 완료, 실패)

#### **핵심 테스트 시나리오**
```
✅ T5.1.1: 사용자 메시지 렌더링
   - 입력: 사용자 메시지 객체
   - 검증: 올바른 스타일 + 타임스탬프 + 사용자 아바타

✅ T5.1.2: AI 메시지 타이핑 효과
   - Mock: AI 응답 스트리밍
   - 검증: 타이핑 인디케이터 + 점진적 텍스트 표시

✅ T5.1.3: 메시지 전송 기능
   - 입력: 메시지 입력 후 Enter 키
   - 검증: API 호출 + 메시지 목록 업데이트

✅ T5.1.4: 채팅 스크롤 동작
   - 입력: 새 메시지 추가
   - 검증: 자동 스크롤 + 수동 스크롤 시 고정
```

#### **개발 태스크**
*   [ ] **Task 5.1.1 (TDD):** Message 컴포넌트 구현
```typescript
// tests/components/chat/Message.test.tsx
describe('Message', () => {
  it('should render user message correctly', () => {
    render(<Message message={mockUserMessage} />);
    expect(screen.getByText(mockUserMessage.content)).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText(formatTime(mockUserMessage.timestamp))).toBeInTheDocument();
  });
  
  it('should render AI message with typing indicator', () => {
    render(<Message message={mockAIMessage} isTyping={true} />);
    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('ai-avatar')).toBeInTheDocument();
  });
  
  it('should handle message status display', () => {
    render(<Message message={{ ...mockUserMessage, status: 'sending' }} />);
    expect(screen.getByTestId('sending-indicator')).toBeInTheDocument();
  });
});
```
*   [ ] **Task 5.1.2 (TDD):** MessageList 컴포넌트 구현 (가상화, 자동 스크롤)
*   [ ] **Task 5.1.3 (TDD):** MessageInput 컴포넌트 구현 (멀티라인, 파일 첨부)
*   [ ] **Task 5.1.4 (TDD):** ChatWindow 컴포넌트 구현 (메시지 전송, 상태 관리)

### **5.2. 워크플로우 실행 및 상태 시각화**

#### **완료 기준 (Definition of Done)**
- [ ] `/` 명령어로 워크플로우를 실행 가능
- [ ] AI의 작업 과정을 실시간으로 시각적으로 확인 가능
- [ ] 워크플로우 단계별 진행 상황 표시
- [ ] 결과에 대한 피드백 제공 기능

#### **핵심 테스트 시나리오**
```
✅ T5.2.1: 워크플로우 명령어 인식
   - 입력: "/" 타이핑
   - 검증: 사용 가능한 워크플로우 목록 표시

✅ T5.2.2: 워크플로우 선택 및 실행
   - 입력: 워크플로우 선택 + 매개변수 입력
   - 검증: 실행 시작 + 진행 상태 표시

✅ T5.2.3: 실시간 상태 업데이트
   - Mock: SSE 워크플로우 상태 이벤트
   - 검증: "분석 중" → "검색 중" → "생성 중" 단계 표시

✅ T5.2.4: 워크플로우 결과 표시
   - 입력: 워크플로우 완료 이벤트
   - 검증: 결과 렌더링 + 피드백 버튼 (👍/👎)
```

#### **개발 태스크**
*   [ ] **Task 5.2.1 (TDD):** 워크플로우 템플릿 선택 UI 구현
```typescript
// tests/components/workflow/WorkflowSelector.test.tsx
describe('WorkflowSelector', () => {
  it('should show workflow list when typing /', () => {
    render(<MessageInput />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '/' } });
    
    expect(screen.getByText('Available Workflows')).toBeInTheDocument();
    expect(screen.getByText('Document Q&A')).toBeInTheDocument();
    expect(screen.getByText('Data Analysis')).toBeInTheDocument();
  });
  
  it('should filter workflows by search', () => {
    render(<MessageInput />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '/doc' } });
    
    expect(screen.getByText('Document Q&A')).toBeInTheDocument();
    expect(screen.queryByText('Data Analysis')).not.toBeInTheDocument();
  });
});
```
*   [ ] **Task 5.2.2 (TDD):** 워크플로우 실행 상태 시각화 컴포넌트 구현
*   [ ] **Task 5.2.3 (TDD):** SSE를 통한 실시간 상태 업데이트 구현
*   [ ] **Task 5.2.4 (TDD):** 워크플로우 결과 표시 및 피드백 UI 구현

### **5.3. 고급 채팅 기능 구현**

#### **완료 기준 (Definition of Done)**
- [ ] 채팅 세션 관리 (새 채팅, 히스토리, 세션 저장/로드)
- [ ] 메시지 재전송 및 편집 기능
- [ ] 연결 끊김 및 에러 상황 처리
- [ ] 마크다운 렌더링 및 코드 하이라이팅

#### **핵심 테스트 시나리오**
```
✅ T5.3.1: 채팅 세션 관리
   - 입력: 새 채팅 시작 버튼 클릭
   - 검증: 현재 채팅 저장 + 새 세션 생성

✅ T5.3.2: 메시지 재전송 기능
   - 입력: 실패한 메시지의 재전송 버튼 클릭
   - 검증: 동일 메시지 재전송 + 상태 업데이트

✅ T5.3.3: 연결 상태 처리
   - Mock: 네트워크 연결 끊김
   - 검증: 연결 상태 표시 + 재연결 시도

✅ T5.3.4: 마크다운 렌더링
   - 입력: 마크다운 형식의 AI 응답
   - 검증: 올바른 HTML 렌더링 + 코드 하이라이팅
```

#### **개발 태스크**
*   [ ] **Task 5.3.1 (TDD):** 채팅 세션 관리 기능 구현
*   [ ] **Task 5.3.2 (TDD):** 메시지 재전송 및 편집 기능 구현
*   [ ] **Task 5.3.3 (TDD):** 연결 끊김 및 에러 상황 처리 UI 구현
*   [ ] **Task 5.3.4 (TDD):** 마크다운 렌더링 및 코드 하이라이팅 구현

#### **Mock/Stub 전략**
- **SSE Connection**: Mock EventSource로 실시간 이벤트 시뮬레이션
- **Chat API**: MSW로 메시지 전송/수신 API 모킹
- **Markdown Parser**: react-markdown 컴포넌트 테스트

---

## **Phase 6: 최종 테스트 및 통합 (Week 7-8)**

*   **목표:** 모든 기능이 통합된 상태에서 안정적으로 작동하며, 배포 준비가 완료된다.

### **6.1. E2E 테스트 및 통합 테스트**

#### **완료 기준 (Definition of Done)**
- [ ] 주요 사용자 시나리오가 E2E 테스트를 통과
- [ ] 모든 API 엔드포인트가 정상 작동
- [ ] 성능 기준 만족 (로드 시간, 응답 시간)
- [ ] 접근성 기본 요구사항 충족

#### **핵심 테스트 시나리오**
```
✅ T6.1.1: 완전한 사용자 여정 테스트
   - 회원가입 → 로그인 → 파일 업로드 → 워크플로우 실행 → 결과 확인
   - 검증: 전체 플로우 30분 내 완료

✅ T6.1.2: 동시 사용자 테스트
   - 입력: 5명의 사용자가 동시에 워크플로우 실행
   - 검증: 각각 독립적으로 처리 완료

✅ T6.1.3: 장애 복구 테스트
   - 시나리오: 서버 재시작 중 워크플로우 실행
   - 검증: 적절한 에러 처리 또는 재시도

✅ T6.1.4: 접근성 테스트
   - 입력: 스크린 리더, 키보드 전용 내비게이션
   - 검증: WCAG 2.1 AA 기준 준수
```

#### **개발 태스크**
*   [ ] **Task 6.1.1:** Playwright E2E 테스트 환경 설정
*   [ ] **Task 6.1.2:** 핵심 사용자 플로우 E2E 테스트 작성
```typescript
// e2e/user-journey.spec.ts
test('complete user journey', async ({ page }) => {
  // 회원가입
  await page.goto('/signup');
  await page.fill('[data-testid=email-input]', 'test@example.com');
  await page.fill('[data-testid=password-input]', 'password123');
  await page.click('[data-testid=signup-button]');
  
  // 대시보드 이동 확인
  await expect(page).toHaveURL('/dashboard');
  
  // 파일 업로드
  await page.setInputFiles('[data-testid=file-upload]', 'test-document.pdf');
  await expect(page.locator('[data-testid=upload-success]')).toBeVisible();
  
  // 워크플로우 실행
  await page.fill('[data-testid=chat-input]', '/document-qa');
  await page.click('[data-testid=workflow-option]');
  await page.fill('[data-testid=chat-input]', 'What is this document about?');
  await page.click('[data-testid=send-button]');
  
  // 결과 확인
  await expect(page.locator('[data-testid=ai-response]')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('[data-testid=feedback-buttons]')).toBeVisible();
});
```
*   [ ] **Task 6.1.3:** 성능 테스트 및 최적화
*   [ ] **Task 6.1.4:** 접근성 테스트 (axe-core, 키보드 네비게이션)

### **6.2. 배포 준비 및 문서화**

#### **완료 기준 (Definition of Done)**
- [ ] 프로덕션 배포가 가능한 상태
- [ ] 개발자 문서가 완성
- [ ] 사용자 가이드 작성 완료
- [ ] 모니터링 및 로깅 시스템 구축

#### **개발 태스크**
*   [ ] **Task 6.2.1:** 프로덕션 빌드 최적화 (코드 스플리팅, 트리 쉐이킹)
*   [ ] **Task 6.2.2:** 환경 변수 및 설정 관리 체계 정리
*   [ ] **Task 6.2.3:** 컴포넌트 문서화 (Storybook 완성)
*   [ ] **Task 6.2.4:** 개발자 가이드 및 API 문서 작성
*   [ ] **Task 6.2.5:** Docker 컨테이너화 및 배포 스크립트 작성

---
## **2. 테스트 도구 및 프레임워크**

### **2.1 Python Backend**
- **Test Framework**: pytest
- **Mocking**: unittest.mock, pytest-mock
- **Async Testing**: pytest-asyncio
- **HTTP Testing**: httpx.AsyncClient (FastAPI)
- **DB Testing**: pytest-postgresql or SQLite in-memory

### **2.2 React Frontend**
- **Test Framework**: Jest + React Testing Library
- **Mocking**: MSW (Mock Service Worker)
- **E2E Testing**: Playwright
- **Component Testing**: Storybook + Storybook Test Runner

### **2.3 Git Hooks 설정 (Refactor-Complete Rule 강제)**
```bash
# pre-commit hook 설정
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 Running quality checks before commit..."

# 1. 모든 테스트 통과 확인
if ! npm test -- --watchAll=false; then
    echo "❌ Frontend tests failing. Cannot commit until all tests pass."
    exit 1
fi

if ! pytest; then
    echo "❌ Backend tests failing. Cannot commit until all tests pass."
    exit 1
fi

# 2. 코드 품질 검사
if ! npm run lint; then
    echo "❌ Frontend linting issues detected. Please fix before commit."
    exit 1
fi

if ! black --check src; then
    echo "❌ Backend code formatting issues detected. Please fix before commit."
    exit 1
fi

# 3. 커밋 메시지 검증
commit_regex="^(RED|GREEN|REFACTOR|COMPLETE|HOTFIX):"
if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message. Must start with RED:|GREEN:|REFACTOR:|COMPLETE:|HOTFIX:"
    exit 1
fi

echo "✅ All checks passed. Proceeding with commit."
```

---

## **3. 성공 기준 및 Exit Criteria**

### **3.1 Phase별 Exit Criteria**
각 Phase는 다음 조건을 **모두** 만족해야 완료:
- [ ] 해당 Phase의 모든 핵심 테스트 통과
- [ ] **Refactor-Complete Rule 준수**: 모든 코드가 리팩터링 완료 상태
- [ ] 코드 커버리지 85% 이상 유지
- [ ] 코드 품질 검사 통과 (linting, formatting, type checking)
- [ ] 팀 코드 리뷰 통과

### **3.2 전체 MVP 성공 기준**
- [ ] Phase 1-6 모든 테스트 통과
- [ ] 실제 사용자 시나리오 E2E 테스트 성공
- [ ] 워크플로우 실행 시간 30분 내 완료
- [ ] 동시 사용자 5명 처리 성공
- [ ] **핵심 기능 모든 정상 동작**: 인증, 파일 업로드, RAG 검색, 워크플로우 실행, 채팅 인터페이스

### **3.3 품질 기준**
- **테스트 커버리지**: 핵심 로직 85% 이상
- **테스트 실행 시간**: Phase별 테스트 30초 이내
- **빌드 시간**: 프론트엔드 빌드 2분 이내
- **접근성**: WCAG 2.1 AA 기준 준수
- **성능**: 
  - 초기 로드 시간 < 3초
  - 페이지 전환 시간 < 1초
  - 워크플로우 응답 시간 < 30초

### **3.4 Refactor-Complete Rule 준수 확인 체크리스트**
```bash
# 각 Phase 완료 시 확인 사항
✅ 모든 테스트 통과 (단위, 통합, E2E)
✅ 코드 포맷팅 일관성 (Prettier, Black)
✅ 린팅 경고 0개 (ESLint, Flake8)
✅ 타입 검사 통과 (TypeScript, MyPy)
✅ 중복 코드 제거
✅ 명확한 함수/변수명 사용
✅ 적절한 주석 및 docstring
✅ 컴포넌트/함수 단일 책임 원칙 준수
✅ 다음 개발자가 이해하기 쉬운 코드 구조
✅ Storybook 컴포넌트 문서화 완료
```