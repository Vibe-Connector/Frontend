import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowers, getFollowing } from '@/api/follow';
import type { FollowUserResponse } from '@/api/follow';

function UserIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

type Tab = 'followers' | 'following';

export default function FollowListModal({
  open,
  onClose,
  userId,
  initialTab,
}: {
  open: boolean;
  onClose: () => void;
  userId: number;
  initialTab: Tab;
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [list, setList] = useState<FollowUserResponse[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // 탭별 데이터 로드 (초기 + pagination)
  const fetchList = useCallback(
    (currentTab: Tab, nextCursor?: string) => {
      const apiFn = currentTab === 'followers' ? getFollowers : getFollowing;
      apiFn(userId, nextCursor, 20)
        .then((res) => {
          const shuffled = [...res.content].sort(() => Math.random() - 0.5);
          setList((prev) => (nextCursor ? [...prev, ...shuffled] : shuffled));
          setCursor(res.nextCursor);
          setHasNext(res.hasNext);
        })
        .catch(() => {
          if (!nextCursor) setList([]);
        })
        .finally(() => setLoading(false));
    },
    [userId],
  );

  // 모달 열릴 때 / initialTab 변경 시 초기 로드 (setState는 async 콜백 내부에서만)
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const currentTab = initialTab;
    const apiFn = currentTab === 'followers' ? getFollowers : getFollowing;
    apiFn(userId, undefined, 20)
      .then((res) => {
        if (cancelled) return;
        const shuffled = [...res.content].sort(() => Math.random() - 0.5);
        setTab(currentTab);
        setList(shuffled);
        setCursor(res.nextCursor);
        setHasNext(res.hasNext);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setTab(currentTab);
        setList([]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [open, initialTab, userId]);

  // 탭 클릭 핸들러
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setList([]);
    setLoading(true);
    fetchList(newTab);
  };

  // 스크롤 pagination
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasNext || !cursor) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      fetchList(tab, cursor);
    }
  };

  // 외부 클릭 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleUserClick = (uid: number) => {
    onClose();
    navigate(`/feed?userId=${uid}`);
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-95 rounded-card bg-white shadow-xl">
        {/* 헤더 + 탭 */}
        <div className="flex border-b border-stroke">
          {(['followers', 'following'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                tab === t ? 'border-b-2 border-high-emphasis text-high-emphasis' : 'text-caption hover:text-high-emphasis'
              }`}
            >
              {t === 'followers' ? '팔로워' : '팔로잉'}
            </button>
          ))}
        </div>

        {/* 리스트 — 고정 높이로 탭 전환 시 크기 유지 */}
        <div ref={scrollRef} onScroll={handleScroll} className="h-100 overflow-y-auto">
          {list.length === 0 && !loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-caption">
                {tab === 'followers' ? '팔로워가 없습니다' : '팔로잉이 없습니다'}
              </p>
            </div>
          ) : (
            list.map((user) => (
              <button
                key={user.userId}
                type="button"
                onClick={() => handleUserClick(user.userId)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface"
              >
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-stroke text-caption">
                  <UserIcon />
                  {user.profileImageUrl && (
                    <img
                      src={user.profileImageUrl}
                      alt={user.nickname}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-high-emphasis">{user.nickname}</span>
              </button>
            ))
          )}
          {loading && (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-stroke border-t-accent" />
            </div>
          )}
        </div>

        {/* 닫기 */}
        <div className="border-t border-stroke p-3">
          <button type="button" onClick={onClose} className="w-full py-2 text-center text-sm text-caption hover:text-high-emphasis">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
