import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { bindAuthStore } from '@/api/interceptors';

// ── 백엔드 TokenResponse DTO 매칭 ──
// 근거: Backend/src/.../auth/dto/TokenResponse.java
export interface TokenResponse {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  accessToken: string;
  refreshToken: string;
}

interface AuthUser {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (response: TokenResponse) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (response) =>
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: {
            userId: response.userId,
            email: response.email,
            nickname: response.nickname,
            profileImageUrl: response.profileImageUrl,
          },
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
    }),
    {
      name: 'vibelink-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// 인터셉터에 authStore 바인딩 (순환 의존 방지)
bindAuthStore(() => useAuthStore.getState());
