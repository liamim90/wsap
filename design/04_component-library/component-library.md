# 📦 포함된 React 컴포넌트들
## 1.🔘 Button Component

Variants: primary, secondary, ghost, success, warning, error
Sizes: xs, sm, base, lg, xl
States: loading, disabled, with icons
Props: TypeScript 인터페이스 완전 지원

## 2. 📝 Form Components

Input: label, error, helper text 지원
Textarea: 리사이즈 제어, 상태 관리
Select: 드롭다운 선택기
모든 HTML 속성 상속 + 커스텀 props

## 3. 🏷️ Badge & Status

Badge: 6가지 variant (workflow 전용 포함)
StatusIndicator: working(애니메이션), complete, error, waiting
실시간 상태 표시: 펄스 애니메이션 지원

## 4. ⚠️ Alert Component

4가지 타입: info, success, warning, error
닫기 기능: onClose 콜백 지원
제목 + 내용: 구조화된 알림

## 5. 🃏 Card Components

Card: 기본 카드 컨테이너
CardHeader, CardBody, CardFooter: 구조화된 레이아웃
그림자 + 테두리: 일관된 디자인

## 6. 💬 Chat Components

ChatMessage: 사용자/어시스턴트 구분
아바타 시스템: 커스텀 아바타 지원
상태 표시: 워크플로우 진행 상황 표시

## 7. ⚡ Workflow Card

아이콘 + 제목 + 설명: 구조화된 정보
배지 시스템: 인기, 신규 태그
평점 + 사용량: 신뢰도 표시
선택 상태: 활성/비활성 구분

## 기술적 특징
### TypeScript 완전 지원
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

### forwardRef 패턴
- 모든 form 컴포넌트에서 ref 전달 지원
- React Hook Form 등과 완벽 호환

### Tailwind CSS 최적화
- 모든 스타일이 Tailwind 유틸리티 클래스
- 커스텀 CSS 없이 완전한 디자인 구현
- 다크모드 준비 (필요시 확장 가능)

### 접근성(Accessibility)
- 의미론적 HTML 구조
- 키보드 네비게이션 지원
- 스크린 리더 친화적
- focus ring 스타일링

# 📦 포함된 Modal 컴포넌트들
## 1. 🏗️ 기본 Modal 시스템

- Modal: 메인 모달 컨테이너 (Portal 렌더링)
- ModalHeader: 제목 영역
- ModalBody: 콘텐츠 영역
- ModalFooter: 액션 버튼 영역

## 2. ⚡ 특화된 Modal들

### 2.1 WorkflowSelectionModal: 워크플로우 선택용
- 실시간 검색 기능
- 카테고리 필터링
- 인기/신규 배지

### 2.2 FileUploadModal: 파일 업로드용
- 드래그앤드롭 지원
- 실시간 업로드 진행률
- 파일 타입/크기 검증

### 2.3 ConfirmationModal: 확인 대화상자
- 3가지 variant (danger, warning, info)
- 커스터마이징 가능한 버튼

## 3. 🚀 핵심 기능들
### 3.1 🎯 사용자 경험
- Portal 렌더링: DOM 최상단 렌더링으로 z-index 충돌 방지
- 키보드 네비게이션: ESC로 닫기, 탭 포커스 이동
- 스크롤 잠금: 모달 열릴 때 배경 스크롤 방지
- 오버레이 클릭: 배경 클릭으로 닫기 (옵션)

### 3.2 🔧 개발자 친화적
- TypeScript 완전 지원: 모든 props 타입 안전
- forwardRef 패턴: React Hook Form 호환
- 커스터마이징: 5가지 크기, 다양한 옵션
- 컴포지션 패턴: 유연한 조합 가능

### 3.3 📱 반응형 디자인
- 모든 디바이스 크기 대응
- 모바일에서 최적화된 터치 인터랙션
- 작은 화면에서 자동 크기 조정

## 4. 🎨 고급 기능들
### 4.1 Portal 시스템
- createPortal 시뮬레이션
- z-index 충돌 완전 방지
- 모달 스택 관리

### 4.2 드래그앤드롭
- 시각적 피드백
- 파일 타입 검증
- 실시간 업로드 진행률

### 4.3 검색 & 필터
- 실시간 텍스트 검색
- 카테고리별 필터링
- 키보드 네비게이션

## 실제 사용 예시
### 1. 기본 Modal
<Modal isOpen={isOpen} onClose={onClose} size="lg">
  <ModalHeader>제목</ModalHeader>
  <ModalBody>내용</ModalBody>
  <ModalFooter>
    <Button onClick={onClose}>취소</Button>
    <Button variant="primary">확인</Button>
  </ModalFooter>
</Modal>

### 2. 워크플로우 선택
<WorkflowSelectionModal
  isOpen={isOpen}
  onClose={onClose}
  workflows={workflows}
  onSelect={(workflow) => setSelectedWorkflow(workflow)}
/>

### 3. 파일업로드
<FileUploadModal
  isOpen={isOpen}
  onClose={onClose}
  acceptedTypes={['.pdf', '.docx', '.txt']}
  maxFileSize={10}
  maxFiles={5}
  onFilesUploaded={(files) => handleFiles(files)}
/>

