import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@/components/Input'

// Meta 정보
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    value: { control: 'text' },
  },
  args: {
    id: 'storybook-input',
    label: 'Label',
  },
}

export default meta
type Story = StoryObj<typeof Input>

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: 'Type something...',
  },
}

// Helper Text 스토리
export const WithHelperText: Story = {
  args: {
    ...Default.args,
    helperText: 'This is a helpful message.',
  },
}

// Error 상태 스토리
export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'This field has an error.',
  },
}

// Error와 Helper Text 동시 존재 스토리
export const WithErrorAndHelperText: Story = {
    args: {
        ...Default.args,
        helperText: "This won't be visible.",
        error: 'The error message takes precedence.',
    },
}

// Disabled 상태 스토리
export const Disabled: Story = {
  args: {
    ...Default.args,
    value: "You can't edit me.",
    disabled: true,
  },
}

// 필수 필드 스토리
export const Required: Story = {
  args: {
    ...Default.args,
    label: 'Required Field',
    required: true,
  },
} 