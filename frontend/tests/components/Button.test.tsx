/**
 * Button 컴포넌트 테스트
 * TDD RED 단계 - Button 컴포넌트의 모든 variants, sizes, states 테스트
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '../../src/components/Button'

describe('Button Component', () => {
  // 1. 기본 렌더링 테스트
  test('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  // 2. Variant 테스트 (6가지)
  test('should apply correct classes for all variants', () => {
    const variants: any[] = ['primary', 'secondary', 'ghost', 'success', 'warning', 'error']
    
    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>Button</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass(`btn-${variant}`)
    })
  })

  // 3. Size 테스트 (5가지)
  test('should apply correct classes for all sizes', () => {
    const sizes: any[] = ['xs', 'sm', 'base', 'lg', 'xl']
    
    sizes.forEach(size => {
      const { container } = render(<Button size={size}>Button</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass(`btn-${size}`)
    })
  })

  // 4. 기본값 테스트
  test('should use default variant and size when not specified', () => {
    const { container } = render(<Button>Default Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('btn-primary') // primary가 기본값
    expect(button).toHaveClass('btn-base') // base가 기본값
  })

  // 5. Disabled 상태 테스트
  test('should handle disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-disabled')
  })

  // 6. Loading 상태 테스트
  test('should handle loading state correctly', () => {
    render(<Button isLoading>Loading Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-loading')
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  // 7. LeftIcon 테스트
  test('should render left icon correctly', () => {
    const leftIcon = <span data-testid="left-icon">🔥</span>
    render(<Button leftIcon={leftIcon}>With Left Icon</Button>)
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByText('With Left Icon')).toBeInTheDocument()
  })

  // 8. RightIcon 테스트
  test('should render right icon correctly', () => {
    const rightIcon = <span data-testid="right-icon">→</span>
    render(<Button rightIcon={rightIcon}>With Right Icon</Button>)
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    expect(screen.getByText('With Right Icon')).toBeInTheDocument()
  })

  // 9. 양쪽 아이콘 테스트
  test('should render both left and right icons', () => {
    const leftIcon = <span data-testid="left-icon">🔥</span>
    const rightIcon = <span data-testid="right-icon">→</span>
    
    render(
      <Button leftIcon={leftIcon} rightIcon={rightIcon}>
        Both Icons
      </Button>
    )
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    expect(screen.getByText('Both Icons')).toBeInTheDocument()
  })

  // 10. Click 이벤트 테스트
  test('should handle click events correctly', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clickable Button</Button>)
    
    const button = screen.getByText('Clickable Button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // 11. Disabled 상태에서 클릭 방지 테스트
  test('should prevent click when disabled', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>)
    
    const button = screen.getByText('Disabled Button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  // 12. Loading 상태에서 클릭 방지 테스트
  test('should prevent click when loading', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} isLoading>Loading Button</Button>)
    
    const button = screen.getByText('Loading Button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  // 13. 커스텀 className 테스트
  test('should support custom className', () => {
    const { container } = render(<Button className="custom-class">Custom Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  // 14. HTML 속성 전달 테스트
  test('should pass through HTML button attributes', () => {
    render(
      <Button 
        type="submit" 
        data-testid="submit-button"
        aria-label="Submit form"
      >
        Submit
      </Button>
    )
    
    const button = screen.getByTestId('submit-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })

  // 15. forwardRef 테스트
  test('should forward ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Button with Ref</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Button with Ref')
  })

  // 16. 아이콘만 있는 버튼 테스트
  test('should handle icon-only buttons', () => {
    const icon = <span data-testid="only-icon">🔥</span>
    render(<Button leftIcon={icon} aria-label="Fire button" />)
    
    expect(screen.getByTestId('only-icon')).toBeInTheDocument()
    expect(screen.getByLabelText('Fire button')).toBeInTheDocument()
  })

  // 17. 접근성 테스트
  test('should have proper accessibility attributes', () => {
    render(<Button>Accessible Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('type', 'button') // 기본 type
    expect(button.tagName).toBe('BUTTON')
  })

  // 18. 다양한 조합 테스트
  test('should handle complex prop combinations', () => {
    const leftIcon = <span data-testid="combo-left">🔥</span>
    
    const { container } = render(
      <Button 
        variant="success" 
        size="lg" 
        leftIcon={leftIcon}
        className="extra-class"
      >
        Complex Button
      </Button>
    )
    
    const button = container.querySelector('button')
    expect(button).toHaveClass('btn-success')
    expect(button).toHaveClass('btn-lg')
    expect(button).toHaveClass('extra-class')
    expect(screen.getByTestId('combo-left')).toBeInTheDocument()
    expect(screen.getByText('Complex Button')).toBeInTheDocument()
  })
}) 