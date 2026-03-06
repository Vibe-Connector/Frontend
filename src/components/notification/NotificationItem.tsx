import type React from 'react';
import type { NotificationResponse } from '@/api/notification';

// ── SVG Icons (타입별) ──

const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const PaletteIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-500">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
  </svg>
);

const BellSmallIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
);

const typeIconMap: Record<string, () => React.ReactElement> = {
  FEED_REACTION: HeartIcon,
  FEED_COMMENT: ChatIcon,
  FOLLOW: UserIcon,
  VIBE_COMPLETE: PaletteIcon,
  REPORT_READY: BellSmallIcon,
  SYSTEM: BellSmallIcon,
};

// ── 상대 시간 포맷 ──

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(isoString).toLocaleDateString('ko-KR');
}

// ── Component ──

interface NotificationItemProps {
  notification: NotificationResponse;
  onClick: (notification: NotificationResponse) => void;
  groupCount?: number;
}

const NotificationItem = ({ notification, onClick, groupCount }: NotificationItemProps) => {
  const IconComponent = typeIconMap[notification.type] ?? BellSmallIcon;
  const hasGroup = groupCount !== undefined && groupCount > 1;

  return (
    <button
      type="button"
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50/40' : ''
      }`}
      onClick={() => onClick(notification)}
    >
      {/* 타입 아이콘 */}
      <div className="mt-0.5 shrink-0 relative">
        <IconComponent />
        {hasGroup && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {groupCount}
          </span>
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-high-emphasis truncate">{notification.title}</p>
        <p className="text-xs text-caption mt-0.5 line-clamp-2">
          {hasGroup
            ? `${notification.body.split('님')[0]}님 외 ${groupCount - 1}명`
            : notification.body}
        </p>
        <p className="text-xs text-muted mt-1">{formatTime(notification.createdAt)}</p>
      </div>

      {/* 미읽음 표시 */}
      {!notification.isRead && (
        <div className="mt-2 shrink-0">
          <span className="block w-2 h-2 rounded-full bg-accent" />
        </div>
      )}
    </button>
  );
};

export default NotificationItem;
