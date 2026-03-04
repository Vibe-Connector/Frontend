import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * 비인증 전용 라우트 가드.
 * - 이미 로그인된 상태에서 /login, /signup 접근 시 → /explore 로 리다이렉트
 * - 미로그인 상태 → children(Outlet) 렌더링
 */
export default function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return <Outlet />;
}
