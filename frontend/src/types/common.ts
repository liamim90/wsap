/**
 * 공통 타입 정의
 */

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  email: string
  name?: string
  avatarUrl?: string
  isActive: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface ErrorDetails {
  code: string
  field?: string
  value?: unknown
}

export interface AppError {
  message: string
  code: string
  statusCode: number
  details?: ErrorDetails[]
} 