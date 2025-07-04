/**
 * 채팅 관련 서비스
 */

import { ChatMessage, ChatSession } from '@/types'
import apiClient from './api'

export const chatService = {
  async getSessions(): Promise<ChatSession[]> {
    const response = await apiClient.get('/chat/sessions')
    return response.data
  },

  async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get(`/chat/sessions/${sessionId}`)
    return response.data
  },

  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, { content })
    return response.data
  },
} 