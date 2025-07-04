/**
 * 기본 API 서비스 설정
 */

import axios, { AxiosError, AxiosResponse } from 'axios'
import type { ApiResponse, AppError } from '@/types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
})

// 기본 설정
apiClient.defaults.headers.common['Content-Type'] = 'application/json'

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<AppError>) => {
    // 401 에러 시 로그아웃 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default apiClient 