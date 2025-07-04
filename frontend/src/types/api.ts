/**
 * API 관련 타입 정의
 */

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export interface SignupRequest {
  email: string
  password: string
  name?: string
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
} 