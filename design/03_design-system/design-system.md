#📋 디자인 시스템 구성 요소
## 1. 🎨 Color System

Primary Colors: 브랜드 메인 컬러 (#2563eb)
Semantic Colors: Success, Warning, Error, Neutral
AI Specific: 그라데이션 (#667eea → #764ba2), 워크플로우 액센트 (#ff9800)

## 2. 📝 Typography

Font Family: Inter (시스템 폰트 fallback)
Size Scale: xs(12px) ~ 5xl(48px)
Weight Scale: Light(300) ~ Extra Bold(800)
Line Height: Tight, Normal, Relaxed

## 3. 🔘 Component Library

Buttons: 6가지 variants × 5가지 sizes
Inputs: 기본, 에러, 비활성 상태
Cards: 기본, 워크플로우 전용
Badges & Status: 상태 표시, 워크플로우 태그
Alerts: 4가지 semantic types
Chat Components: 사용자/어시스턴트 구분

## 4. 📐 Spacing & Layout

Spacing Scale: 2px ~ 96px (8의 배수 기반)
Border Radius: 0px ~ 24px + full
Box Shadows: 5단계 그림자 시스템
Z-Index: 계층적 레이어 관리

##5. 개발자를 위한 가이드
### 5.1 CSS Variables 방식
.my-component {
  background-color: var(--color-primary-600);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

### 5.2 Utility Classes 방식
<button class="btn btn-primary btn-lg">
  <span class="status-indicator status-working"></span>
  워크플로우 실행 중
</button>

### 5.3 React 컴포넌트 방식
<Button variant="primary" size="lg">
  <StatusIndicator status="working" />
  워크플로우 실행 중
</Button>