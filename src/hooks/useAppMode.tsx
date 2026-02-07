import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AppModeContextValue, ProfilePage, SidebarMode } from '../types/app-mode';

/**
 * Header ↔ Sidebar 간 모드 상태를 공유하기 위한 Context.
 * - explore 모드: 기본 탐색 (Home, My Feed, Archive, Report)
 * - profile 모드: 프로필 관리 (Home, My Info, Settings)
 */
const AppModeContext = createContext<AppModeContextValue | null>(null);

/** App 최상단에서 감싸는 Provider — 모드 상태와 전환 함수를 제공 */
export function AppModeProvider({ children }: { children: ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('explore');
  const [profilePage, setProfilePage] = useState<ProfilePage | null>(null);

  /** 프로필 모드 진입 — 사이드바 전환 + 해당 페이지 활성화 */
  const switchToProfile = (page: ProfilePage) => {
    setSidebarMode('profile');
    setProfilePage(page);
  };

  /** Explore 모드 복귀 — 사이드바 원복 + 프로필 페이지 초기화 */
  const switchToExplore = () => {
    setSidebarMode('explore');
    setProfilePage(null);
  };

  return (
    <AppModeContext.Provider value={{ sidebarMode, profilePage, switchToProfile, switchToExplore }}>
      {children}
    </AppModeContext.Provider>
  );
}

/**
 * AppMode Context 소비 훅.
 * Header, Sidebar 등에서 현재 모드 상태와 전환 함수에 접근할 때 사용합니다.
 */
export function useAppMode(): AppModeContextValue {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
}
