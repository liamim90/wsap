/**
 * 인증 관련 서비스
 */

import apiClient from './api';
import useAuthStore from '../stores/authStore';

// 나중에 백엔드 API 명세에 맞춰 수정해야 합니다.
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface SignupCredentials extends LoginCredentials {
  name: string; // Or any other fields required for signup
}

export const login = async (credentials: LoginCredentials): Promise<void> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data) {
      const { access_token, user } = response.data;
      const { login: storeLogin } = useAuthStore.getState();
      storeLogin(user, access_token);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const signup = async (credentials: SignupCredentials): Promise<void> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/signup', {
      email: credentials.username,
      password: credentials.password,
      name: credentials.name, // Adjust based on actual backend model
    });

    if (response.data) {
      const { access_token, user } = response.data;
      const { login: storeLogin } = useAuthStore.getState();
      // Signup is successful, log the user in immediately
      storeLogin(user, access_token);
    }
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
}; 