/**
 * 워크플로우 관련 타입 정의
 */

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  parameters: WorkflowParameter[]
  popularity: number
  isNew: boolean
}

export interface WorkflowParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'file'
  required: boolean
  description: string
  defaultValue?: any
}

export interface WorkflowExecution {
  id: string
  templateId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  currentStep?: string
  result?: any
  error?: string
  startedAt: string
  completedAt?: string
} 