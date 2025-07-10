import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 나중에 백엔드 모델과 동기화해야 합니다.
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (userData, token) => set({
        isAuthenticated: true,
        user: userData,
        token,
      }),
      logout: () => set({
        isAuthenticated: false,
        user: null,
        token: null,
      }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 때 사용될 키
    }
  )
);

export default useAuthStore; 