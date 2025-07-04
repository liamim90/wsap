import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

// Meta 정보
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  subcomponents: { CardHeader, CardBody, CardFooter },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

// 기본 스토리
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <h3 className="text-lg font-semibold">Card Title</h3>
      </CardHeader>
      <CardBody>
        <p>This is the main content area of the card. You can put any components or text here.</p>
      </CardBody>
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}

// Header만 있는 카드
export const HeaderOnly: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-neutral-dark">You have 3 unread messages.</p>
            </CardHeader>
        </Card>
    ),
}

// 복잡한 컨텐츠가 있는 카드
export const WithComplexContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <h3 className="text-lg font-semibold">Create a New Project</h3>
        <p className="text-sm text-neutral-dark">Fill in the details below to get started.</p>
      </CardHeader>
      <CardBody>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input id="name" label="Name" placeholder="Name of your project" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input id="framework" label="Framework" placeholder="e.g., Next.js, Vite" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  ),
} 