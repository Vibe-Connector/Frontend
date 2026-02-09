import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppMode } from '../../hooks/useAppMode';

/* ─── Icons (Material Design, viewBox 0 0 24 24) ─── */

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const FeedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);

const ReportIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  </svg>
);

const MyInfoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

/* ─── Types ─── */

type SidebarItemData = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

/* ─── Sidebar ─── */

const Sidebar = () => {
  const navigate = useNavigate();
  const { sidebarMode, switchToExplore, switchToProfile } = useAppMode();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const exploreItems: SidebarItemData[] = [
    { icon: <HomeIcon />, label: 'Home', onClick: () => { switchToExplore(); navigate('/'); } },
    { icon: <FeedIcon />, label: 'My Feed', onClick: () => navigate('/feed') },
    { icon: <ArchiveIcon />, label: 'Archive', onClick: () => navigate('/archive') },
  ];

  const profileItems: SidebarItemData[] = [
    { icon: <HomeIcon />, label: 'Home', onClick: () => { switchToExplore(); navigate('/'); } },
    { icon: <MyInfoIcon />, label: 'My Info', onClick: () => { switchToProfile('my-info'); navigate('/profile'); } },
    { icon: <ReportIcon />, label: 'Report', onClick: () => { switchToProfile('report'); navigate('/profile/report'); } },
    { icon: <SettingsIcon />, label: 'Settings', onClick: () => { switchToProfile('settings'); navigate('/profile/settings'); } },
  ];

  const items = sidebarMode === 'explore' ? exploreItems : profileItems;

  /* p-4 (16px × 2) + w-6 (24px) = 56px */
  const BUTTON_SIZE = 56;

  const getScale = (index: number): number => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.6;
    if (distance === 1) return 1.4;
    if (distance === 2) return 1.2;
    return 1.0;
  };

  return (
    <nav
      className="fixed left-5 top-1/2 -translate-y-1/2 z-50
        flex flex-col items-center gap-3"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, index) => {
        const scale = getScale(index);
        const isHovered = hoveredIndex === index;
        const size = BUTTON_SIZE * scale;

        return (
          <div
            key={item.label}
            className="relative flex items-center justify-center
              animate-smooth"
            style={{ width: size, height: size }}
          >
            <button
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={item.onClick}
              className="p-4 rounded-2xl bg-surface text-sidebar-icon
                animate-smooth cursor-pointer"
              style={{ transform: `scale(${scale})` }}
            >
              {item.icon}
            </button>

            {/* Label tooltip — slides in from left on hover */}
            <div
              className={`absolute left-full top-1/2 -translate-y-1/2 ml-3
                bg-surface rounded-xl px-4 py-2
                whitespace-nowrap text-sm font-bold text-sidebar-text
                animate-smooth pointer-events-none
                ${isHovered
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2'
                }`}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default Sidebar;
