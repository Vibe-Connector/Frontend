import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppModeProvider } from '@/hooks/AppModeContext';
import { useAppMode } from '@/hooks/useAppMode';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

/** AppModeProvider 내부에서 경로 기반 사이드바 모드 동기화 + 레이아웃 렌더링 */
function AppLayoutInner() {
  const location = useLocation();
  const { switchToProfile, switchToExplore } = useAppMode();

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/profile/settings')) {
      switchToProfile('settings');
    } else if (path.startsWith('/profile') || path.startsWith('/archive')) {
      switchToProfile('my-info');
    } else {
      switchToExplore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function AppLayout() {
  return (
    <AppModeProvider>
      <AppLayoutInner />
    </AppModeProvider>
  );
}
