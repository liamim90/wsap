import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '@/components/Typography'

// Meta 정보
const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-lg', 'body', 'body-sm', 'caption'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'muted'],
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: 'radio',
      options: ['left', 'center', 'right', 'justify'],
    },
    truncate: { control: 'boolean' },
    gradient: { control: 'boolean' },
    as: { control: 'text' },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export default meta
type Story = StoryObj<typeof Typography>

// 기본 스토리
export const Default: Story = {
  args: {
    variant: 'body',
  },
}

// Heading 스토리
export const Headings: Story = {
  render: () => (
    <div>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </div>
  ),
}

// Body 텍스트 스토리
export const BodyTexts: Story = {
  render: () => (
    <div>
      <Typography variant="body-lg">Body Large</Typography>
      <Typography variant="body">Body Regular</Typography>
      <Typography variant="body-sm">Body Small</Typography>
      <Typography variant="caption">Caption</Typography>
    </div>
  ),
}

// 색상 스토리
export const Colors: Story = {
  render: () => (
    <div>
      <Typography color="primary">Primary Color</Typography>
      <Typography color="secondary">Secondary Color</Typography>
      <Typography color="success">Success Color</Typography>
      <Typography color="warning">Warning Color</Typography>
      <Typography color="error">Error Color</Typography>
      <Typography color="muted">Muted Color</Typography>
    </div>
  ),
}

// 그라데이션 스토리
export const Gradient: Story = {
  args: {
    variant: 'h1',
    gradient: true,
    children: 'Gradient Text Effect',
  },
} 