import React, { forwardRef, InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const inputVariants = cva(
  'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-main focus:ring-primary-main sm:text-sm disabled:bg-neutral-light disabled:cursor-not-allowed',
  {
    variants: {
      hasError: {
        true: 'border-semantic-error-main text-semantic-error-main focus:border-semantic-error-main focus:ring-semantic-error-main',
      },
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  id: string
  label: string
  helperText?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, helperText, error, required, disabled, className, ...props }, ref) => {
    const descriptionId = `${id}-description`
    const hasError = !!error

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor={id} className="block text-sm font-medium text-neutral-darkest">
            {label}
            {required && <span className="text-semantic-error-main ml-1">*</span>}
          </label>
        </div>
        <input
          id={id}
          ref={ref}
          type="text"
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError || helperText ? descriptionId : undefined}
          className={cn(inputVariants({ hasError, className }))}
          {...props}
        />
        {(helperText || error) && (
          <p
            id={descriptionId}
            className={cn('mt-2 text-sm', hasError ? 'text-semantic-error-main' : 'text-neutral-dark')}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input 