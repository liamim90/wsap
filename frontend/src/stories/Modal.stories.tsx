import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/Modal'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

// Meta 정보
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  subcomponents: { ModalHeader, ModalBody, ModalFooter },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // 모달을 중앙에 표시
  },
  argTypes: {
    isOpen: { control: false }, // 상태는 스토리에서 직접 제어
    onClose: { action: 'closed' },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

// 기본 스토리
export const Default: Story = {
  render: (args) => {
    // Storybook에서 상태를 관리하기 위한 hook
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalHeader>
            <h2 className="text-lg font-bold">Modal Title</h2>
          </ModalHeader>
          <ModalBody>
            <p>This is the main content of the modal. You can place any text or components here.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  },
}

// 복잡한 컨텐츠가 있는 모달
export const WithComplexContent: Story = {
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false)

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open Complex Modal</Button>
                <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalHeader>
                        <h2 className="text-lg font-bold">Create New User</h2>
                        <p className="text-sm text-neutral-dark">Enter user details below.</p>
                    </ModalHeader>
                    <ModalBody>
                        <div className="grid gap-4 py-4">
                            <Input id="name" label="Name" placeholder="John Doe" />
                            <Input id="email" label="Email" placeholder="john.doe@example.com" type="email" />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setIsOpen(false)}>Create User</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    },
} 