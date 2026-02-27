import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './types';

// authStore는 순환 의존 방지를 위해 lazy import
let getAuthState: () => {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export function bindAuthStore(getter: typeof getAuthState) {
  getAuthState = getter;
}

// ── 토큰 갱신 큐 (동시 401 대응) ──
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function processPendingRequests(token: string) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

function rejectPendingRequests() {
  pendingRequests = [];
}

// ── 공통 인터셉터 설정 ──
export function setupInterceptors(instance: AxiosInstance) {
  // Request: JWT 토큰 자동 주입 + i18n 언어 헤더
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { accessToken } = getAuthState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 백엔드 LanguageInterceptor가 Accept-Language를 파싱하여 languageId 결정
    // MVP에서는 'ko' 고정, 향후 언어 설정 스토어에서 읽도록 확장
    config.headers['Accept-Language'] = 'ko';

    return config;
  });

  // Response: ApiResponse 래퍼 해체 + 에러 변환 + 토큰 갱신
  instance.interceptors.response.use(
    (response) => {
      const body = response.data;

      // 백엔드 ApiResponse의 success 필드 체크
      if (body && body.success === false) {
        return Promise.reject(
          new ApiError(body.message ?? '요청 실패', body.code ?? 'UNKNOWN', response.status),
        );
      }

      // success: true → data만 추출하여 반환
      return body.data;
    },
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      // 401 + 아직 재시도 안 한 요청 → refresh 시도
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { refreshToken, setTokens } = getAuthState();

            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            // refresh 엔드포인트는 인터셉터를 타지 않는 별도 axios 요청
            const res = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
              { refreshToken },
            );

            const newAccess: string = res.data.data.accessToken;
            const newRefresh: string = res.data.data.refreshToken;
            setTokens(newAccess, newRefresh);

            // 대기 중이던 요청들에 새 토큰 전달
            processPendingRequests(newAccess);

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return instance(originalRequest);
          } catch {
            rejectPendingRequests();
            getAuthState().logout();
            window.location.href = '/login';
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        }

        // 이미 refresh 진행 중 → 큐에 대기
        return new Promise((resolve) => {
          pendingRequests.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      // 그 외 에러 → ApiError로 변환
      return Promise.reject(
        new ApiError(
          error.response?.data?.message ?? error.message,
          error.response?.data?.code ?? 'NETWORK_ERROR',
          status ?? 0,
        ),
      );
    },
  );
}
