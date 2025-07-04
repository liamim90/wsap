/**
 * 채팅 관련 타입 정의
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  status?: 'sending' | 'sent' | 'failed'
  attachments?: ChatAttachment[]
  workflowExecution?: {
    id: string
    status: string
    progress: number
  }
}

export interface ChatAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
} 