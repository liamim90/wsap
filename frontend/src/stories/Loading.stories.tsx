import type { Meta, StoryObj } from '@storybook/react'
import { Loading } from '@/components/Loading'

// Meta 정보
const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral'],
    },
    text: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Loading>

// 기본 스토리
export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
}

// Sizes 스토리
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Loading size="sm" />
      <Loading size="md" />
      <Loading size="lg" />
      <Loading size="xl" />
    </div>
  ),
}

// Colors 스토리
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Loading color="primary" />
      <Loading color="secondary" />
      <Loading color="neutral" />
    </div>
  ),
}

// 텍스트와 함께 사용하는 스토리
export const WithText: Story = {
  args: {
    size: 'lg',
    text: 'Loading data, please wait...',
  },
} 