/** 사이드바 모드 — explore: 기본 탐색, profile: 프로필 관리 */
export type SidebarMode = 'explore' | 'profile';

/** 프로필 모드 내 활성 페이지 */
export type ProfilePage = 'my-info' | 'settings';

/** AppMode Context가 제공하는 상태 및 액션 */
export interface AppModeContextValue {
  /** 현재 사이드바 모드 */
  sidebarMode: SidebarMode;
  /** 프로필 모드일 때 활성 페이지 (explore 모드에서는 null) */
  profilePage: ProfilePage | null;
  /** 프로필 모드로 전환하며 해당 페이지 활성화 */
  switchToProfile: (page: ProfilePage) => void;
  /** 기본 Explore 모드로 복귀 */
  switchToExplore: () => void;
}
