import { useContext } from 'react';
import { AppModeContext } from './AppModeContext';
import type { AppModeContextValue } from '../types/app-mode';

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
