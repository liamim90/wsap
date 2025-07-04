/**
 * Input 컴포넌트 테스트
 * TDD RED 단계 - Input 컴포넌트의 기본 기능 및 상태(validation, disabled) 테스트
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Input } from '../../src/components/Input'

describe('Input Component', () => {
  // 1. 기본 렌더링 테스트
  test('should render input with label and correct id/for mapping', () => {
    render(<Input id="username" label="Username" />)
    const input = screen.getByLabelText('Username')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'username')
  })

  // 2. Placeholder 테스트
  test('should render with a placeholder', () => {
    render(<Input id="email" label="Email" placeholder="you@example.com" />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })

  // 3. 값 변경 테스트
  test('should allow value to be changed', async () => {
    const user = userEvent.setup()
    render(<Input id="test" label="Test Input" />)
    const input = screen.getByLabelText('Test Input') as HTMLInputElement
    
    await user.type(input, 'hello world')
    expect(input.value).toBe('hello world')
  })

  // 4. Helper text 테스트
  test('should render helper text when provided', () => {
    render(<Input id="password" label="Password" helperText="Must be at least 8 characters long." />)
    const helperText = screen.getByText('Must be at least 8 characters long.')
    expect(helperText).toBeInTheDocument()
    // 접근성을 위해 helper text가 input과 연결되어 있는지 확인
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('aria-describedby')
    expect(document.getElementById(input.getAttribute('aria-describedby')!)).toEqual(helperText)
  })

  // 5. Error 상태 테스트
  test('should render error message and apply error styles', () => {
    render(<Input id="confirmPassword" label="Confirm Password" error="Passwords do not match." />)
    const errorMessage = screen.getByText('Passwords do not match.')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-semantic-error-main')

    const input = screen.getByLabelText('Confirm Password')
    expect(input).toHaveClass('border-semantic-error-main')
    // 접근성을 위해 error message가 input과 연결되어 있는지 확인
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(document.getElementById(input.getAttribute('aria-describedby')!)).toEqual(errorMessage)
  })

  // 6. Helper text와 Error 메시지 동시 존재 시 Error 우선순위 테스트
  test('should show error message instead of helper text when both are provided', () => {
    render(<Input id="email" label="Email" helperText="Enter your email" error="Invalid email format" />)
    
    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument()
  })

  // 7. Disabled 상태 테스트
  test('should be disabled when disabled prop is true', () => {
    render(<Input id="apikey" label="API Key" disabled />)
    const input = screen.getByLabelText('API Key')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:bg-neutral-light disabled:cursor-not-allowed')
  })

  // 8. forwardRef 테스트
  test('should forward ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} id="ref-test" label="Ref Test" />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.id).toBe('ref-test')
  })
    
  // 9. 필수 필드 표시 테스트
  test('should show required indicator when required prop is true', () => {
    render(<Input id="required-field" label="Required Field" required />)
    const label = screen.getByText('Required Field')
    const requiredIndicator = screen.getByText('*')
    
    expect(label).toBeInTheDocument()
    expect(requiredIndicator).toBeInTheDocument()
    expect(requiredIndicator).toHaveClass('text-semantic-error-main')
  })

  // 10. 커스텀 className 테스트
  test('should apply custom className to the input', () => {
    render(<Input id="custom" label="Custom" className="my-custom-class" />)
    const input = screen.getByLabelText('Custom')
    expect(input).toHaveClass('my-custom-class')
  })
    
  // 11. HTML 속성 전달 테스트
  test('should pass through native HTML input attributes', () => {
    render(<Input id="html-props" label="HTML Props" type="password" autoComplete="current-password" />)
    const input = screen.getByLabelText('HTML Props')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('autoComplete', 'current-password')
  })
}) 