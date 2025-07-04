# 1. 네비게이션 구조 설계
## 1.1 Primary Navigation(메인 네비게이션션)
### 1.1.1. 💬 Chat (채팅)
   - 메인 대화 인터페이스
   - 워크플로우 실행 공간
   - 파일 첨부 및 업로드

### 1.1.2. ⚡ Workflows (워크플로우)
   - 공식 템플릿 목록
   - 템플릿 상세 정보
   - 파라미터 설정 및 미리보기

### 1.1.3. 📁 Documents (문서)
   - 개인 컬렉션 관리
   - 문서 업로드 및 처리 상태
   - RAG 데이터 관리

### 1.1.4. ⚙️ Settings (설정)
   - API 키 관리
   - 사용자 프로필
   - 알림 설정

## 1.2 Secondary Navigation(보조 네비게이션)
### 1.2.1 Header 영역:
- 🔔 Notifications (알림)
- 👤 User Profile (사용자 프로필)
- ❓ Help & Support (도움말)

### 1.2.2 Footer/Contextual:
- 📊 Usage & Billing (사용량)
- 🔗 Integrations (연동 설정)

# 2. 정보 계층 구조
## 2.1 Lavel 1: 주요 기능 영역
┌─ Chat Interface
├─ Workflow Management  
├─ Document Management
└─ System Settings

## 2.2 Level 2: 기능별 세부 영역
Chat Interface
├─ Message History
├─ Input Area
├─ File Attachment
├─ Workflow Trigger (/ commands)
└─ Real-time Status Panel

Workflow Management
├─ Template Gallery
├─ Category Filters
├─ Search & Discovery
├─ Parameter Configuration
└─ Execution History

Document Management
├─ Personal Collection
├─ Upload Interface
├─ Processing Status
├─ Search & Filter
└─ Collection Analytics

System Settings
├─ API Key Management
├─ User Profile
├─ Notification Preferences
└─ Security Settings

# 3. 사용자 권한별 접근 제어
## 3.1 개인(Individual) 스코프
### 3.1.1 ✅ 허용:
- 개인 채팅 히스토리
- 개인 문서 컬렉션
- 공식 템플릿 사용
- 개인 API 키 관리

### 3.1.2 ❌ 제한:
- 팀/공용 컬렉션 (Phase 2 기능)
- 사용자 정의 템플릿 생성 (Phase 2 기능)

## 3.2 향후 확장 고려사항(MVP 2.0)
### 3.2.1 팀 (Team) 스코프:
- 팀 공유 컬렉션
- 팀 템플릿 공유
- 팀 사용량 대시보드

### 3.2.2 조직 (Organization) 스코프:
- 조직 정책 관리
- 전체 사용량 모니터링
- 보안 설정 관리

# 4. 콘텐츠 우선순위 정의
## 4.1 Primary Content(최우선)
### 1. Chat Interface
   - 대화창 (80% 화면 비중)
   - 메시지 입력창
   - 실시간 에이전트 상태

### 2. Workflow Selection
   - / 커맨드 트리거
   - 템플릿 선택 모달
   - 파라미터 입력 폼

## 4.2. Secondary Content(보조)
### 1. Status & Progress
   - 현재 실행 단계
   - 진행률 표시
   - 에러/성공 상태

### 2. File Management
   - 업로드 드래그앤드롭
   - 첨부 파일 목록
   - 처리 상태 표시

### 3. Quick Actions
   - 즐겨찾는 템플릿
   - 최근 사용 워크플로우
   - 피드백 버튼 (👍/👎)

## 4.3 Tertiary Content(부가)
### 1. Navigation & Controls
   - 사이드바 토글
   - 설정 접근
   - 도움말 링크

### 2. Meta Information
   - 사용량 정보
   - 시간 표시
   - 버전 정보

# 5. 정보 흐름 및 상태 관리
## 5.1 데이터 흐름
User Input → Workflow Selection → Parameter Input → Execution → Real-time Status → Results → Feedback

## 5.2 상태 계층
Global State:
├─ User Authentication
├─ API Configuration
└─ App Settings

Session State:
├─ Chat History
├─ Current Workflow
├─ Upload Progress
└─ Agent Status

Local State:
├─ Form Inputs
├─ UI Interactions
├─ Modal States
└─ Animation States

# 6. 검색 및 발견 구조
## 6.1 워크플로우 발견
### 6.1.1 Discovery Methods:
#### 1. Category Browse
   - 업무 유형별 분류
   - 인기도 기반 정렬
   
#### 2. Search
   - 키워드 검색
   - 태그 기반 필터
   
#### 3. Recommendations
   - 사용 이력 기반
   - 유사 사용자 기반

## 6.2 문서 관리
### 6.2.1 Organization:
1. Upload Date
2. File Type
3. Processing Status
4. Usage Frequency

### 6.2.2 Search:
1. Filename
2. Content Search (향후)
3. Metadata Tags