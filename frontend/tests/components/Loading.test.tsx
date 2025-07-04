/**
 * Loading 컴포넌트 테스트
 * TDD RED 단계 - Loading 컴포넌트의 size, color, accessibility 테스트
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Loading } from '../../src/components/Loading'

describe('Loading Component', () => {
  // 1. 기본 렌더링 테스트
  test('should render correctly with default props', () => {
    const { container } = render(<Loading />)
    const spinnerContainer = screen.getByTestId('loading-spinner')
    const svgElement = container.querySelector('svg')
    
    expect(spinnerContainer).toBeInTheDocument()
    // 기본 스타일 클래스 확인 (SVG 요소 대상)
    expect(svgElement).toHaveClass('w-8 h-8')
    expect(svgElement).toHaveClass('text-primary-main')
  })

  // 2. Size 테스트
  test.each(['sm', 'md', 'lg', 'xl'] as const)(
    'should render with correct size class for size "%s"',
    (size) => {
      const { container } = render(<Loading size={size} />)
      const svgElement = container.querySelector('svg')
      
      const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
      }
      
      expect(svgElement).toHaveClass(sizeMap[size])
    }
  )

  // 3. Color 테스트
  test.each(['primary', 'secondary', 'neutral'] as const)(
    'should render with correct color class for color "%s"',
    (color) => {
      const { container } = render(<Loading color={color} />)
      const svgElement = container.querySelector('svg')
      
      const colorMap = {
        primary: 'text-primary-main',
        secondary: 'text-secondary-main',
        neutral: 'text-neutral-dark',
      }
      
      expect(svgElement).toHaveClass(colorMap[color])
    }
  )
  
  // 4. 커스텀 className 테스트
  test('should apply custom className', () => {
    const { container } = render(<Loading className="my-custom-spinner" />)
    const svgElement = container.querySelector('svg')
    expect(svgElement).toHaveClass('my-custom-spinner')
  })

  // 5. 접근성(a11y) 테스트
  test('should have accessible attributes', () => {
    render(<Loading />)
    const spinnerContainer = screen.getByTestId('loading-spinner')
    expect(spinnerContainer).toHaveAttribute('role', 'status')
    // 접근성을 위한 스크린 리더 전용 텍스트 확인
    const srOnlyText = screen.getByText('Loading...')
    expect(srOnlyText).toHaveClass('sr-only')
  })

  // 6. 텍스트와 함께 렌더링될 때 테스트
  test('should render with a loading text', () => {
    render(<Loading text="데이터를 불러오는 중..." />)
    expect(screen.getByText('데이터를 불러오는 중...')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
}) 