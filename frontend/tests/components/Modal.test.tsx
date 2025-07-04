/**
 * Modal 컴포넌트 테스트
 * TDD RED 단계 - Modal 및 하위 컴포넌트, 핵심 기능(Portal, a11y, events) 테스트
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../src/components/Modal'

describe('Modal Component Suite', () => {
  // 1. 기본 렌더링 테스트
  test('should not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Modal Content</Modal>)
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  test('should render when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Modal Content</Modal>)
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  // 2. 구조 테스트
  test('should render with header, body, and footer', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <ModalHeader>Header</ModalHeader>
        <ModalBody>Body</ModalBody>
        <ModalFooter>Footer</ModalFooter>
      </Modal>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  // 3. Portal 렌더링 테스트
  test('should render into a portal', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Portal Content</Modal>)
    // portal로 렌더링된 요소는 container의 자식이 아니어야 함
    const { container } = render(<div />)
    expect(container.querySelector('[data-testid="modal-content"]')).toBeNull()
    expect(document.body.querySelector('[data-testid="modal-content"]')).toBeInTheDocument()
  })
  
  // 4. 이벤트 핸들러 테스트
  test('should call onClose when backdrop is clicked', () => {
    const handleClose = jest.fn()
    render(<Modal isOpen={true} onClose={handleClose}>Modal</Modal>)

    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('should not call onClose when modal content is clicked', () => {
    const handleClose = jest.fn()
    render(<Modal isOpen={true} onClose={handleClose}>Modal</Modal>)
    
    fireEvent.click(screen.getByTestId('modal-content'))
    expect(handleClose).not.toHaveBeenCalled()
  })

  test('should call onClose when Escape key is pressed', () => {
    const handleClose = jest.fn()
    render(<Modal isOpen={true} onClose={handleClose}>Modal</Modal>)

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // 5. 접근성(a11y) 및 Focus Trap 테스트
  test('should have correct ARIA attributes', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Modal</Modal>)
    const modalContent = screen.getByTestId('modal-content')
    expect(modalContent).toHaveAttribute('role', 'dialog')
    expect(modalContent).toHaveAttribute('aria-modal', 'true')
  })

  test('should trap focus within the modal', async () => {
    const user = userEvent.setup()
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <input data-testid="input1" />
        <button data-testid="button1">Click</button>
        <a href="/" data-testid="link1">Link</a>
      </Modal>
    )

    const input = screen.getByTestId('input1')
    const button = screen.getByTestId('button1')
    const link = screen.getByTestId('link1')

    // 포커스가 첫 번째 요소로 가야 함
    await waitFor(() => expect(input).toHaveFocus())

    // Tab 키를 누르면 다음 요소로 이동
    await user.tab()
    expect(button).toHaveFocus()

    // Tab 키를 한번 더 누르면 다음 요소로 이동
    await user.tab()
    expect(link).toHaveFocus()

    // Tab 키를 한번 더 누르면 처음으로 돌아와야 함 (focus trap)
    await user.tab()
    expect(input).toHaveFocus()

    // Shift + Tab을 누르면 마지막 요소로 가야 함 (focus trap)
    await user.tab({ shift: true })
    expect(link).toHaveFocus()
  })

  // 6. 기타 기능 테스트
  test('should prevent body from scrolling when open', () => {
    const { rerender } = render(<Modal isOpen={false} onClose={() => {}} />)
    expect(document.body).not.toHaveStyle('overflow: hidden')
    
    rerender(<Modal isOpen={true} onClose={() => {}} />)
    expect(document.body).toHaveStyle('overflow: hidden')

    rerender(<Modal isOpen={false} onClose={() => {}} />)
    expect(document.body).not.toHaveStyle('overflow: hidden')
  })
}) 