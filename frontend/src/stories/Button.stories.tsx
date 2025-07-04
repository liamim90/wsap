import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/Button'

// Meta 정보
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    leftIcon: { control: false }, // 아이콘은 스토리에서 직접 제어
    rightIcon: { control: false },
  },
  args: {
    children: 'Button',
  },
}

export default meta
type Story = StoryObj<typeof Button>

// 기본 스토리
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'base',
  },
}

// Variants 스토리
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="error">Error</Button>
    </div>
  ),
}

// Sizes 스토리
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center flex-wrap gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="base">Base</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

// States 스토리
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button isLoading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}

// 아이콘 스토리
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon="🔥">Left Icon</Button>
      <Button rightIcon="→">Right Icon</Button>
      <Button leftIcon="🚀" rightIcon="✅">
        Both Icons
      </Button>
      <Button isLoading leftIcon="⏰">
        Loading with Icon
      </Button>
    </div>
  ),
}

// 아이콘 전용 버튼 스토리
export const IconOnly: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Button size="xs" leftIcon="❤️" aria-label="Like" />
            <Button size="sm" leftIcon="⚙️" aria-label="Settings" />
            <Button size="base" leftIcon="🗑️" aria-label="Delete" />
            <Button size="lg" leftIcon="➕" aria-label="Add" />
            <Button size="xl" leftIcon="⭐" aria-label="Favorite" />
      </div>
    ),
} 