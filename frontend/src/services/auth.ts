/**
 * 인증 관련 서비스
 */

import { LoginRequest, LoginResponse, SignupRequest } from '@/types'
import apiClient from './api'

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  async signup(data: SignupRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/signup', data)
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
} 