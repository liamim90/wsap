import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
      },
      color: {
        primary: 'text-primary-main',
        secondary: 'text-secondary-main',
        neutral: 'text-neutral-dark',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  }
)

export interface LoadingProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  text?: string;
}

export const Loading = ({ size, color, className, text }: LoadingProps) => {
  return (
    <div
      role="status"
      data-testid="loading-spinner"
      className="flex flex-col items-center justify-center"
    >
      <svg
        className={cn(spinnerVariants({ size, color }), className)}
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
      <span className="sr-only">Loading...</span>
      {text && <p className="mt-2 text-sm text-neutral-dark">{text}</p>}
    </div>
  )
}

export default Loading 