import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

/**
 * LoadingSpinner 컴포넌트
 */
const LoadingSpinner = () => (
  <svg
    data-testid="loading-spinner"
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const buttonVariants = cva(
  'btn inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
  {
    variants: {
      variant: {
        primary: 'btn-primary bg-primary-main text-white hover:bg-primary-dark focus:ring-primary-main',
        secondary: 'btn-secondary bg-secondary-main text-white hover:bg-secondary-dark focus:ring-secondary-main',
        ghost: 'btn-ghost text-primary-main hover:bg-primary-light focus:ring-primary-main',
        success: 'btn-success bg-semantic-success-main text-white hover:bg-semantic-success-dark focus:ring-semantic-success-main',
        warning: 'btn-warning bg-semantic-warning-main text-white hover:bg-semantic-warning-dark focus:ring-semantic-warning-main',
        error: 'btn-error bg-semantic-error-main text-white hover:bg-semantic-error-dark focus:ring-semantic-error-main'
      },
      size: {
        xs: 'btn-xs px-2.5 py-1.5 text-xs',
        sm: 'btn-sm px-3 py-2 text-sm',
        base: 'btn-base px-4 py-2 text-base',
        lg: 'btn-lg px-6 py-3 text-lg',
        xl: 'btn-xl px-8 py-4 text-xl'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base'
    }
  }
)

type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'h-4 w-4',
  sm: 'h-4 w-4',
  base: 'h-5 w-5',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6'
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Button 컴포넌트
 * 
 * 디자인 시스템의 Button 가이드라인을 따르는 버튼 컴포넌트입니다.
 * 6개의 variants, 5개의 sizes, loading/disabled 상태, 아이콘을 지원합니다.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={() => alert('Clicked!')}>
 *   메인 액션
 * </Button>
 * 
 * <Button variant="ghost" isLoading leftIcon={<PlusIcon />}>
 *   항목 추가
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const isDisabled = isLoading || props.disabled
  
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        isDisabled && 'btn-disabled opacity-50 cursor-not-allowed',
        isLoading && 'btn-loading'
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <span className={cn('mr-2', iconSizeStyles[size || 'base'])}>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className={cn('ml-2', iconSizeStyles[size || 'base'])}>{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'
export default Button 