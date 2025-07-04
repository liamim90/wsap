import type { Meta, StoryObj } from '@storybook/react'
import { designTokens } from '../constants/design-tokens'

const Welcome = () => {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-h1 font-bold text-gradient mb-4">
          WSAP Design System
        </h1>
        <p className="text-body-lg text-neutral-dark">
          워크플로우 기반 AI 서비스의 디자인 시스템입니다.
        </p>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-h3 font-semibold mb-4">디자인 토큰</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-h5 font-medium mb-2">Primary Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary-light"></div>
                <span className="text-body-sm">Light</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary-main"></div>
                <span className="text-body-sm">Main</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary-dark"></div>
                <span className="text-body-sm">Dark</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-h5 font-medium mb-2">Typography</h3>
            <div className="space-y-2">
              <div className="text-h6">Heading 6</div>
              <div className="text-body">Body Text</div>
              <div className="text-body-sm">Small Text</div>
              <div className="text-caption">Caption</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-h3 font-semibold mb-4">컴포넌트 미리보기</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-outline">Outline Button</button>
          </div>
          
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Input field" 
              className="input"
            />
            <textarea 
              placeholder="Textarea field" 
              className="input min-h-[100px]"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-ai-gradient rounded-lg shadow-ai-glow"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-main rounded-lg shadow-glow"></div>
            <div className="w-16 h-16 bg-semantic-success-main rounded-lg shadow-md"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-body-sm text-neutral-medium">
          이제 컴포넌트를 개발하고 스토리를 작성해보세요! 🎨
        </p>
      </div>
    </div>
  )
}

const meta: Meta<typeof Welcome> = {
  title: 'Design System/Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'WSAP 디자인 시스템의 시작 페이지입니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCustomBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'brand',
    },
  },
} 