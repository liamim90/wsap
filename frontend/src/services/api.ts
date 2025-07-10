/**
 * 기본 API 서비스 설정
 */

import axios from 'axios';
import useAuthStore from '../stores/authStore';

const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 요청 보내기 전에 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 발생 시 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      // 로그인 페이지로 리디렉션
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient; 