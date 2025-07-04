/**
 * 워크플로우 관련 서비스
 */

import { WorkflowTemplate, WorkflowExecution } from '@/types'
import apiClient from './api'

export const workflowService = {
  async getTemplates(): Promise<WorkflowTemplate[]> {
    const response = await apiClient.get('/workflows/templates')
    return response.data
  },

  async executeWorkflow(templateId: string, parameters: Record<string, any>): Promise<WorkflowExecution> {
    const response = await apiClient.post(`/workflows/${templateId}/execute`, { parameters })
    return response.data
  },

  async getExecution(executionId: string): Promise<WorkflowExecution> {
    const response = await apiClient.get(`/workflows/executions/${executionId}`)
    return response.data
  },
} 