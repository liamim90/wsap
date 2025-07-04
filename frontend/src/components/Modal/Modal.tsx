import React, { forwardRef, HTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // 1. Escape 키 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // 2. 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // 3. Focus Trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      firstElement?.focus()

      const handleTabKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
      modalRef.current.addEventListener('keydown', handleTabKeyPress)

      return () => {
        modalRef.current?.removeEventListener('keydown', handleTabKeyPress)
      }
    }
  }, [isOpen])
  
  if (!isOpen) return null

  // 4. Portal을 사용한 렌더링
  return createPortal(
    <div
      data-testid="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        data-testid="modal-content"
        role="dialog"
        aria-modal="true"
        className={cn('bg-white rounded-lg shadow-xl m-4', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

// --- ModalHeader ---
const ModalHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 border-b', className)}
    {...props}
  />
))
ModalHeader.displayName = 'ModalHeader'

// --- ModalBody ---
const ModalBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props} />
))
ModalBody.displayName = 'ModalBody'

// --- ModalFooter ---
const ModalFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 border-t flex justify-end space-x-4', className)}
    {...props}
  />
))
ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalHeader, ModalBody, ModalFooter } 