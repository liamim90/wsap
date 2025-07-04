/**
 * Card 컴포넌트 테스트
 * TDD RED 단계 - Card 및 하위 컴포넌트(Header, Body, Footer)의 렌더링 및 구조 테스트
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter 
} from '../../src/components/Card'

describe('Card Component Suite', () => {
  // 1. 기본 Card 렌더링 테스트
  test('should render a basic card with children', () => {
    render(<Card>Card Content</Card>)
    const cardElement = screen.getByText('Card Content')
    expect(cardElement).toBeInTheDocument()
    expect(cardElement).toHaveClass('card-base-styles') // 기본 스타일 클래스
  })

  // 2. CardHeader 렌더링 테스트
  test('should render CardHeader with a title', () => {
    render(<CardHeader>Card Title</CardHeader>)
    const headerElement = screen.getByText('Card Title')
    expect(headerElement).toBeInTheDocument()
    expect(headerElement).toHaveClass('card-header-styles')
  })

  // 3. CardBody 렌더링 테스트
  test('should render CardBody with content', () => {
    render(<CardBody>This is the body of the card.</CardBody>)
    const bodyElement = screen.getByText('This is the body of the card.')
    expect(bodyElement).toBeInTheDocument()
    expect(bodyElement).toHaveClass('card-body-styles')
  })

  // 4. CardFooter 렌더링 테스트
  test('should render CardFooter with content', () => {
    render(<CardFooter>Footer Actions</CardFooter>)
    const footerElement = screen.getByText('Footer Actions')
    expect(footerElement).toBeInTheDocument()
    expect(footerElement).toHaveClass('card-footer-styles')
  })

  // 5. 전체 구조 조합 테스트
  test('should render a complete card with header, body, and footer', () => {
    render(
      <Card>
        <CardHeader>
          <h2>Complete Card Title</h2>
        </CardHeader>
        <CardBody>
          <p>This is the full content of the card.</p>
        </CardBody>
        <CardFooter>
          <button>Action 1</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Complete Card Title')).toBeInTheDocument()
    expect(screen.getByText('This is the full content of the card.')).toBeInTheDocument()
    expect(screen.getByText('Action 1')).toBeInTheDocument()
  })

  // 6. 커스텀 className 테스트 (모든 컴포넌트)
  test('should apply custom className to all card components', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">Header</CardHeader>
        <CardBody className="custom-body">Body</CardBody>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Header').parentElement).toHaveClass('custom-card')
    expect(screen.getByText('Header')).toHaveClass('custom-header')
    expect(screen.getByText('Body')).toHaveClass('custom-body')
    expect(screen.getByText('Footer')).toHaveClass('custom-footer')
  })

  // 7. forwardRef 테스트 (모든 컴포넌트)
  test('should forward refs to the underlying elements', () => {
    const cardRef = React.createRef<HTMLDivElement>()
    const headerRef = React.createRef<HTMLDivElement>()
    const bodyRef = React.createRef<HTMLDivElement>()
    const footerRef = React.createRef<HTMLDivElement>()

    render(
      <Card ref={cardRef}>
        <CardHeader ref={headerRef}>Header</CardHeader>
        <CardBody ref={bodyRef}>Body</CardBody>
        <CardFooter ref={footerRef}>Footer</CardFooter>
      </Card>
    )

    expect(cardRef.current).toBeInstanceOf(HTMLDivElement)
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement)
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement)
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement)
  })

  // 8. HTML 속성 전달 테스트
  test('should pass through HTML attributes', () => {
    render(<Card data-testid="card-with-attributes">Card</Card>)
    expect(screen.getByTestId('card-with-attributes')).toBeInTheDocument()
  })
}) 