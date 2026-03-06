import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getNotifications,
  markAllAsRead,
  type NotificationResponse,
} from '@/api/notification';
import NotificationItem from './NotificationItem';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick: (notification: NotificationResponse) => void;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationPanel = ({
  isOpen,
  onClose,
  onNotificationClick,
  onUnreadCountChange,
}: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 패널 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (!isOpen) return;
    setNotifications([]);
    setCursor(undefined);
    setHasMore(true);
    setLoadedOnce(false);
    loadNotifications(undefined);
  }, [isOpen]);

  const loadNotifications = async (cursorVal?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getNotifications(cursorVal, 15);
      const items = res.content ?? [];
      setNotifications((prev) => (cursorVal ? [...prev, ...items] : items));
      setHasMore(res.hasNext ?? false);
      if (items.length > 0) {
        setCursor(String(items[items.length - 1].notificationId));
      }
    } catch {
      /* API 실패 시 빈 목록 유지 */
    } finally {
      setLoading(false);
      setLoadedOnce(true);
    }
  };

  // 무한스크롤
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      loadNotifications(cursor);
    }
  }, [loading, hasMore, cursor]);

  // 모두 읽음
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onUnreadCountChange?.(0);
    } catch {
      /* 실패 시 무시 */
    }
  };

  if (!isOpen) return null;

  const showEmpty = notifications.length === 0 && !loading && loadedOnce;

  return (
    <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-white rounded-xl shadow-lg border border-black/10 z-50 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
        <h3 className="text-sm font-semibold text-high-emphasis">알림</h3>
        <button
          type="button"
          className="text-xs text-accent hover:underline cursor-pointer"
          onClick={handleMarkAllAsRead}
        >
          모두 읽음
        </button>
      </div>

      {/* 알림 목록 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {showEmpty && (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            새로운 알림이 없습니다
          </div>
        )}

        {notifications.map((n) => (
          <NotificationItem
            key={n.notificationId}
            notification={n}
            onClick={onNotificationClick}
          />
        ))}

        {/* 로딩 Skeleton */}
        {loading && (
          <div className="px-4 py-3 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
