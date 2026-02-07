import { useState, useRef, useCallback } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useAppMode } from '../../hooks/useAppMode';
import type { ProfilePage } from '../../types/app-mode';

/**
 * 프로필 드롭다운 — 헤더 우측 프로필 아바타 클릭 시 표시되는 액션 메뉴.
 * 메뉴 항목: 내 정보, 설정, 로그아웃
 *
 * Dropdown.tsx의 click-outside 패턴을 useClickOutside 훅으로 공통화하여 재사용하고,
 * 동일한 스타일 토큰(rounded-control, shadow-card 등)을 적용합니다.
 */

/* ─── 트리거 아이콘 (Header의 UserIcon과 동일) ─── */
const UserIcon = () => (
  <svg
    viewBox="1703 41 27 28"
    className="w-4.5 h-4.5 text-icon"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1727.13 66.1147C1726.5 64.3605 1725.12 62.8104 1723.2 61.7048C1721.28 60.5993 1718.92 60 1716.5 60C1714.08 60 1711.72 60.5993 1709.8 61.7048C1707.88 62.8104 1706.5 64.3605 1705.87 66.1147"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle
      cx="1716.5"
      cy="49"
      r="5.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── 메뉴 항목 타입 ─── */
type ProfileMenuItem = {
  label: string;
  action: ProfilePage | 'logout';
};

/** 드롭다운 메뉴 항목 목록 */
const MENU_ITEMS: ProfileMenuItem[] = [
  { label: '내 정보', action: 'my-info' },
  { label: '설정', action: 'settings' },
  { label: '로그아웃', action: 'logout' },
];

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { switchToProfile } = useAppMode();

  /** 바깥 클릭 시 드롭다운 닫기 — useClickOutside 훅 사용 */
  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(containerRef, close, isOpen);

  /** 메뉴 항목 클릭 핸들러 */
  const handleItemClick = (action: ProfileMenuItem['action']) => {
    if (action === 'logout') {
      // TODO: 로그아웃 로직 구현
    } else {
      switchToProfile(action);
    }
    setIsOpen(false);
  };

  /** 키보드 접근성 — Escape로 닫기, Enter/Space로 토글 */
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 트리거: 프로필 아바타 영역 */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center gap-2 cursor-pointer"
      >
        <UserIcon />
        <span className="text-brand text-sm">Nickname</span>
      </button>

      {/* 드롭다운 메뉴 — Dropdown.tsx와 동일한 스타일 토큰 사용 */}
      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[160px]
            rounded-control bg-white py-1 shadow-card z-50"
        >
          {MENU_ITEMS.map((item) => (
            <li
              key={item.action}
              role="menuitem"
              tabIndex={0}
              onClick={() => handleItemClick(item.action)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item.action);
                }
              }}
              className="cursor-pointer px-4 py-3 text-sm text-high-emphasis
                hover:bg-input transition-colors duration-100"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
