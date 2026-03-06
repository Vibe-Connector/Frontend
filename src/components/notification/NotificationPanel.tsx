import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  getNotifications,
  markAllAsRead,
  type NotificationResponse,
} from '@/api/notification';
import NotificationItem from './NotificationItem';

// ── 그루핑 타입 & 유틸 ──

interface GroupedNotification {
  representative: NotificationResponse;
  groupCount: number;
  notificationIds: number[];
}

const ONE_HOUR_MS = 60 * 60 * 1000;

function groupNotifications(list: NotificationResponse[]): GroupedNotification[] {
  const groups: GroupedNotification[] = [];
  const visited = new Set<number>();

  for (const item of list) {
    if (visited.has(item.notificationId)) continue;

    // 같은 type + referenceId 조합으로 1시간 이내 알림을 그룹화
    const siblings = list.filter((other) => {
      if (visited.has(other.notificationId)) return false;
      if (other.notificationId === item.notificationId) return false;
      if (other.type !== item.type) return false;
      if (other.referenceId !== item.referenceId || item.referenceId == null) return false;
      const timeDiff = Math.abs(
        new Date(item.createdAt).getTime() - new Date(other.createdAt).getTime(),
      );
      return timeDiff <= ONE_HOUR_MS;
    });

    const group: GroupedNotification = {
      representative: item,
      groupCount: 1 + siblings.length,
      notificationIds: [item.notificationId, ...siblings.map((s) => s.notificationId)],
    };

    visited.add(item.notificationId);
    for (const s of siblings) visited.add(s.notificationId);

    groups.push(group);
  }

  return groups;
}

// ── Component ──

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick: (notification: NotificationResponse) => void;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationPanel = ({
  isOpen,
  onNotificationClick,
  onUnreadCountChange,
}: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadNotifications = useCallback(async (cursorVal?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
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
      loadingRef.current = false;
      setLoading(false);
      setLoadedOnce(true);
    }
  }, []);

  // 패널 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (!isOpen) return;
    setNotifications([]);
    setCursor(undefined);
    setHasMore(true);
    setLoadedOnce(false);
    loadNotifications(undefined);
  }, [isOpen, loadNotifications]);

  // 무한스크롤
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loadingRef.current || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      loadNotifications(cursor);
    }
  }, [hasMore, cursor, loadNotifications]);

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

  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);

  if (!isOpen) return null;

  const showEmpty = notifications.length === 0 && !loading && loadedOnce;

  return (
    <div className="absolute right-0 top-full mt-2 w-95 max-h-120 bg-white rounded-xl shadow-lg border border-black/10 z-50 flex flex-col overflow-hidden">
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

        {grouped.map((g) => (
          <NotificationItem
            key={g.representative.notificationId}
            notification={g.representative}
            onClick={onNotificationClick}
            groupCount={g.groupCount}
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
