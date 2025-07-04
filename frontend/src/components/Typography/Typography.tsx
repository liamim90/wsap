import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * Typography variant 타입 정의
 */
export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body-lg' | 'body' | 'body-sm' | 'caption'

/**
 * Typography 색상 variant 타입 정의
 */
export type TypographyColor = 
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted'

/**
 * Typography 폰트 weight 타입 정의
 */
export type TypographyWeight = 
  | 'light' | 'normal' | 'medium' | 'semibold' | 'bold'

/**
 * Typography 텍스트 정렬 타입 정의
 */
export type TypographyAlign = 
  | 'left' | 'center' | 'right' | 'justify'

/**
 * Typography 컴포넌트의 props 타입 정의
 */
export interface TypographyProps {
  /** 텍스트 variant (기본값: 'body') */
  variant?: TypographyVariant
  /** HTML 요소 override (as prop) */
  as?: keyof JSX.IntrinsicElements
  /** 텍스트 색상 variant */
  color?: TypographyColor
  /** 폰트 weight */
  weight?: TypographyWeight
  /** 텍스트 정렬 */
  align?: TypographyAlign
  /** 텍스트 말줄임표 처리 */
  truncate?: boolean
  /** 그라데이션 텍스트 효과 */
  gradient?: boolean
  /** 추가 CSS 클래스 */
  className?: string
  /** 자식 요소 */
  children: React.ReactNode
}

/**
 * Variant별 기본 HTML 요소 매핑
 */
const variantElementMap: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2', 
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span'
} as const

/**
 * Variant별 스타일 클래스 매핑
 */
const variantStyleMap: Record<TypographyVariant, string> = {
  h1: 'text-5xl font-bold leading-tight',
  h2: 'text-4xl font-bold leading-tight',
  h3: 'text-3xl font-semibold leading-tight', 
  h4: 'text-2xl font-semibold leading-tight',
  h5: 'text-xl font-medium leading-tight',
  h6: 'text-lg font-medium leading-tight',
  'body-lg': 'text-lg leading-relaxed',
  body: 'text-body leading-normal',
  'body-sm': 'text-sm leading-normal',
  caption: 'text-xs leading-normal'
} as const

/**
 * 색상 variant별 클래스 매핑
 */
const colorClassMap: Record<TypographyColor, string> = {
  primary: 'text-primary-main',
  secondary: 'text-secondary-main', 
  success: 'text-semantic-success-main',
  warning: 'text-semantic-warning-main',
  error: 'text-semantic-error-main',
  muted: 'text-neutral-medium'
} as const

/**
 * 폰트 weight별 클래스 매핑
 */
const weightClassMap: Record<TypographyWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium', 
  semibold: 'font-semibold',
  bold: 'font-bold'
} as const

/**
 * 텍스트 정렬별 클래스 매핑
 */
const alignClassMap: Record<TypographyAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
} as const

/**
 * Typography 컴포넌트
 * 
 * 디자인 시스템의 Typography 가이드라인을 따르는 텍스트 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <Typography variant="h1" color="primary" gradient>
 *   메인 제목
 * </Typography>
 * 
 * <Typography variant="body" weight="medium" truncate>
 *   본문 텍스트
 * </Typography>
 * ```
 */
export const Typography = forwardRef<HTMLElement, TypographyProps>(({
  variant = 'body',
  as,
  color,
  weight,
  align,
  truncate = false,
  gradient = false,
  className,
  children,
}, ref) => {
  // HTML 요소 결정 (as prop 우선, 없으면 variant 기본값)
  const Element = as || variantElementMap[variant]
  
  // 클래스 조합
  const classes = cn(
    // 기본 variant 스타일
    variantStyleMap[variant],
    
    // 색상 클래스 (설정된 경우에만)
    color && colorClassMap[color],
    
    // 폰트 weight 클래스 (설정된 경우에만)
    weight && weightClassMap[weight],
    
    // 텍스트 정렬 클래스 (설정된 경우에만)
    align && alignClassMap[align],
    
    // 말줄임표 처리
    truncate && 'truncate',
    
    // 그라데이션 효과
    gradient && 'text-gradient',
    
    // 추가 클래스
    className
  )

  // 공통 props
  const commonProps = {
    ref: ref as any,
    className: classes,
  }

  // 요소별 렌더링 (타입 안전성을 위해)
  switch (Element) {
    case 'h1':
      return <h1 {...commonProps} role="heading" aria-level="1">{children}</h1>
    case 'h2':
      return <h2 {...commonProps} role="heading" aria-level="2">{children}</h2>
    case 'h3':
      return <h3 {...commonProps} role="heading" aria-level="3">{children}</h3>
    case 'h4':
      return <h4 {...commonProps} role="heading" aria-level="4">{children}</h4>
    case 'h5':
      return <h5 {...commonProps} role="heading" aria-level="5">{children}</h5>
    case 'h6':
      return <h6 {...commonProps} role="heading" aria-level="6">{children}</h6>
    case 'p':
      return <p {...commonProps}>{children}</p>
    case 'span':
      return <span {...commonProps}>{children}</span>
    case 'div':
      return <div {...commonProps}>{children}</div>
    case 'label':
      return <label {...commonProps}>{children}</label>
    default:
      return <p {...commonProps}>{children}</p>
  }
})

// displayName 설정 (개발자 도구에서 식별하기 위함)
Typography.displayName = 'Typography'

// 기본 export
export default Typography 