/**
 * Typography 컴포넌트 테스트
 * TDD RED 단계 - Typography 컴포넌트의 모든 variants 테스트
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Typography } from '../../src/components/Typography'

describe('Typography Component', () => {
  test('should render heading variants correctly', () => {
    render(<Typography variant="h1">Heading 1</Typography>)
    render(<Typography variant="h2">Heading 2</Typography>)
    render(<Typography variant="h3">Heading 3</Typography>)
    render(<Typography variant="h4">Heading 4</Typography>)
    render(<Typography variant="h5">Heading 5</Typography>)
    render(<Typography variant="h6">Heading 6</Typography>)

    expect(screen.getByText('Heading 1')).toBeInTheDocument()
    expect(screen.getByText('Heading 2')).toBeInTheDocument()
    expect(screen.getByText('Heading 3')).toBeInTheDocument()
    expect(screen.getByText('Heading 4')).toBeInTheDocument()
    expect(screen.getByText('Heading 5')).toBeInTheDocument()
    expect(screen.getByText('Heading 6')).toBeInTheDocument()
  })

  test('should render body text variants correctly', () => {
    render(<Typography variant="body-lg">Large body text</Typography>)
    render(<Typography variant="body">Regular body text</Typography>)
    render(<Typography variant="body-sm">Small body text</Typography>)
    render(<Typography variant="caption">Caption text</Typography>)

    expect(screen.getByText('Large body text')).toBeInTheDocument()
    expect(screen.getByText('Regular body text')).toBeInTheDocument()
    expect(screen.getByText('Small body text')).toBeInTheDocument()
    expect(screen.getByText('Caption text')).toBeInTheDocument()
  })

  test('should apply correct HTML elements for each variant', () => {
    const { container } = render(
      <div>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="body">Body text</Typography>
        <Typography variant="caption">Caption</Typography>
      </div>
    )

    expect(container.querySelector('h1')).toHaveTextContent('Heading 1')
    expect(container.querySelector('h2')).toHaveTextContent('Heading 2')
    expect(container.querySelector('h3')).toHaveTextContent('Heading 3')
    expect(container.querySelector('h4')).toHaveTextContent('Heading 4')
    expect(container.querySelector('h5')).toHaveTextContent('Heading 5')
    expect(container.querySelector('h6')).toHaveTextContent('Heading 6')
    expect(container.querySelector('p')).toHaveTextContent('Body text')
    expect(container.querySelector('span')).toHaveTextContent('Caption')
  })

  test('should override HTML element with as prop', () => {
    const { container } = render(
      <Typography variant="h1" as="span">
        Span with H1 styling
      </Typography>
    )

    expect(container.querySelector('span')).toHaveTextContent('Span with H1 styling')
    expect(container.querySelector('h1')).toBeNull()
  })

  test('should apply color variants correctly', () => {
    render(
      <div>
        <Typography variant="body" color="primary">Primary text</Typography>
        <Typography variant="body" color="secondary">Secondary text</Typography>
        <Typography variant="body" color="success">Success text</Typography>
        <Typography variant="body" color="warning">Warning text</Typography>
        <Typography variant="body" color="error">Error text</Typography>
        <Typography variant="body" color="muted">Muted text</Typography>
      </div>
    )

    expect(screen.getByText('Primary text')).toHaveClass('text-primary-main')
    expect(screen.getByText('Secondary text')).toHaveClass('text-secondary-main')
    expect(screen.getByText('Success text')).toHaveClass('text-semantic-success-main')
    expect(screen.getByText('Warning text')).toHaveClass('text-semantic-warning-main')
    expect(screen.getByText('Error text')).toHaveClass('text-semantic-error-main')
    expect(screen.getByText('Muted text')).toHaveClass('text-neutral-medium')
  })

  test('should apply weight variants correctly', () => {
    render(
      <div>
        <Typography variant="body" weight="light">Light text</Typography>
        <Typography variant="body" weight="normal">Normal text</Typography>
        <Typography variant="body" weight="medium">Medium text</Typography>
        <Typography variant="body" weight="semibold">Semibold text</Typography>
        <Typography variant="body" weight="bold">Bold text</Typography>
      </div>
    )

    expect(screen.getByText('Light text')).toHaveClass('font-light')
    expect(screen.getByText('Normal text')).toHaveClass('font-normal')
    expect(screen.getByText('Medium text')).toHaveClass('font-medium')
    expect(screen.getByText('Semibold text')).toHaveClass('font-semibold')
    expect(screen.getByText('Bold text')).toHaveClass('font-bold')
  })

  test('should apply align variants correctly', () => {
    render(
      <div>
        <Typography variant="body" align="left">Left aligned</Typography>
        <Typography variant="body" align="center">Center aligned</Typography>
        <Typography variant="body" align="right">Right aligned</Typography>
        <Typography variant="body" align="justify">Justified text</Typography>
      </div>
    )

    expect(screen.getByText('Left aligned')).toHaveClass('text-left')
    expect(screen.getByText('Center aligned')).toHaveClass('text-center')
    expect(screen.getByText('Right aligned')).toHaveClass('text-right')
    expect(screen.getByText('Justified text')).toHaveClass('text-justify')
  })

  test('should support truncation', () => {
    render(
      <Typography variant="body" truncate>
        This is a very long text that should be truncated
      </Typography>
    )

    expect(screen.getByText('This is a very long text that should be truncated'))
      .toHaveClass('truncate')
  })

  test('should support custom className', () => {
    render(
      <Typography variant="body" className="custom-class">
        Custom styled text
      </Typography>
    )

    expect(screen.getByText('Custom styled text')).toHaveClass('custom-class')
  })

  test('should support gradient text effect', () => {
    render(
      <Typography variant="h1" gradient>
        Gradient text
      </Typography>
    )

    expect(screen.getByText('Gradient text')).toHaveClass('text-gradient')
  })

  test('should handle children correctly', () => {
    const { container } = render(
      <Typography variant="body">
        Text with <strong>bold</strong> and <em>italic</em> elements
      </Typography>
    )

    // 전체 컨테이너에 모든 텍스트가 포함되어 있는지 확인
    expect(container).toHaveTextContent('Text with bold and italic elements')
    
    // 개별 요소들이 존재하는지 확인
    expect(container.querySelector('strong')).toHaveTextContent('bold')
    expect(container.querySelector('em')).toHaveTextContent('italic')
    expect(container.querySelector('p')).toBeInTheDocument()
  })
}) 