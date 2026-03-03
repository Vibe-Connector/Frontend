import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * 인증 필요 라우트 가드.
 * - isAuthenticated === false → /login으로 리다이렉트
 * - isAuthenticated === true → children(Outlet) 렌더링
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
