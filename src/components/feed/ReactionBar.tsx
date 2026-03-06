import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleReaction, getReactionUsers } from '@/api/feed';
import type { ReactionSummary, ReactionType, ReactionUserResponse } from '@/api/types';

/* ---------- 반응 아이콘 ---------- */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg {...iconProps} fill={filled ? 'currentColor' : 'none'}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ThumbsUpIcon({ filled }: { filled?: boolean }) {
  return (
    <svg {...iconProps} fill={filled ? 'currentColor' : 'none'}>
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbDownIcon({ filled }: { filled?: boolean }) {
  return (
    <svg {...iconProps} fill={filled ? 'currentColor' : 'none'}>
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  );
}

function WowFaceIcon({ filled }: { filled?: boolean }) {
  return (
    <svg {...iconProps} fill={filled ? 'currentColor' : 'none'}>
      <circle cx="12" cy="12" r="10" />
      {/* 눈 */}
      <circle cx="9" cy="10" r="1" fill={filled ? 'white' : 'currentColor'} stroke="none" />
      <circle cx="15" cy="10" r="1" fill={filled ? 'white' : 'currentColor'} stroke="none" />
      {/* 놀란 입 */}
      <circle cx="12" cy="16" r="2" fill="none" stroke={filled ? 'white' : 'currentColor'} strokeWidth="2" />
    </svg>
  );
}

function DoubleHeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg {...iconProps} fill={filled ? 'currentColor' : 'none'}>
      {/* 뒤쪽 작은 하트 */}
      <path d="M15.5 3.5a3.5 3.5 0 0 0-2.36.92L12 5.5l-1.14-1.08A3.5 3.5 0 0 0 5.91 9.3l1.14 1.08L12 15.1l4.95-4.72 1.14-1.08a3.5 3.5 0 0 0-2.59-5.8z" opacity={filled ? 0.5 : 0.4} />
      {/* 앞쪽 큰 하트 */}
      <path d="M16.5 8.5a4 4 0 0 0-2.83 1.17L12 11.34l-1.67-1.67a4 4 0 1 0-5.66 5.66l1.67 1.67L12 22.66l5.66-5.66 1.67-1.67a4 4 0 0 0-2.83-6.83z" />
    </svg>
  );
}

/* ---------- 반응 타입 설정 ---------- */

type ReactionIconComponent = React.FC<{ filled?: boolean }>;

const REACTION_CONFIG: {
  type: ReactionType;
  Icon: ReactionIconComponent;
  label: string;
  activeColor: string;
}[] = [
  { type: 'LIKE', Icon: ThumbsUpIcon, label: '좋아요', activeColor: 'text-red-500' },
  { type: 'DISLIKE', Icon: ThumbDownIcon, label: '싫어요', activeColor: 'text-blue-500' },
  { type: 'WOW', Icon: WowFaceIcon, label: '놀라워요', activeColor: 'text-amber-500' },
  { type: 'LOVE', Icon: DoubleHeartIcon, label: '사랑해요', activeColor: 'text-pink-500' },
];

const REACTION_ICON: Record<string, ReactionIconComponent> = {
  LIKE: ThumbsUpIcon,
  DISLIKE: ThumbDownIcon,
  WOW: WowFaceIcon,
  LOVE: DoubleHeartIcon,
};

const REACTION_COLOR: Record<string, string> = {
  LIKE: 'text-red-500',
  DISLIKE: 'text-blue-500',
  WOW: 'text-amber-500',
  LOVE: 'text-pink-500',
};

/* ---------- Props ---------- */

interface ReactionBarProps {
  feedId: number;
  reactions: ReactionSummary[];
  myReactionTypes: string[];
}

/* ---------- Component ---------- */

export default function ReactionBar({ feedId, reactions, myReactionTypes }: ReactionBarProps) {
  const navigate = useNavigate();

  // 현재 사용자의 반응 (단일 반응: 0~1개)
  const [myType, setMyType] = useState<ReactionType | null>(
    (myReactionTypes[0] as ReactionType) ?? null,
  );
  // 타입별 카운트
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const r of reactions) map[r.reactionType] = r.count;
    return map;
  });

  // props 변경 시 state 동기화 (API 응답이 마운트 이후 도착하는 경우)
  useEffect(() => {
    setMyType((myReactionTypes[0] as ReactionType) ?? null);
    const map: Record<string, number> = {};
    for (const r of reactions) map[r.reactionType] = r.count;
    setCounts(map);
  }, [reactions, myReactionTypes]);

  const [pending, setPending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [reactionUsers, setReactionUsers] = useState<ReactionUserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCount = Object.values(counts).reduce((sum, c) => sum + c, 0);

  // 외부 클릭 시 picker 닫기
  useEffect(() => {
    if (!showPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPicker]);

  // 반응 토글 처리
  const handleReaction = useCallback(
    async (type: ReactionType) => {
      if (pending) return;
      setShowPicker(false);

      const prevType = myType;
      const isSameType = prevType === type;

      // Optimistic update
      if (isSameType) {
        // 토글 off
        setMyType(null);
        setCounts((prev) => ({ ...prev, [type]: Math.max((prev[type] ?? 0) - 1, 0) }));
      } else {
        // 새 반응 또는 교체
        setMyType(type);
        setCounts((prev) => {
          const next = { ...prev, [type]: (prev[type] ?? 0) + 1 };
          if (prevType) next[prevType] = Math.max((next[prevType] ?? 0) - 1, 0);
          return next;
        });
      }

      // 반응 변경 시 사용자 목록 캐시 초기화
      setReactionUsers([]);

      setPending(true);
      try {
        await toggleReaction(feedId, type);
      } catch {
        // 롤백
        setMyType(prevType);
        setCounts((prev) => {
          const next = { ...prev };
          if (isSameType) {
            next[type] = (next[type] ?? 0) + 1;
          } else {
            next[type] = Math.max((next[type] ?? 0) - 1, 0);
            if (prevType) next[prevType] = (next[prevType] ?? 0) + 1;
          }
          return next;
        });
      } finally {
        setPending(false);
      }
    },
    [feedId, myType, pending],
  );

  // Long press 핸들러
  const handlePointerDown = () => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setShowPicker(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // 꾹 누르지 않은 일반 클릭 → 반응 있으면 토글 off, 없으면 LIKE
    if (!didLongPress.current) {
      handleReaction(myType ?? 'LIKE');
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // 호버 시 사용자 목록 로드
  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(async () => {
      setShowUsers(true);
      if (reactionUsers.length === 0) {
        setLoadingUsers(true);
        try {
          const users = await getReactionUsers(feedId);
          setReactionUsers(users);
        } catch {
          /* 무시 */
        } finally {
          setLoadingUsers(false);
        }
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setShowUsers(false);
  };

  // 메인 버튼: 항상 하트 아이콘 (반응 유무에 따라 filled/unfilled)
  const hasReaction = !!myType;
  const currentColor = hasReaction ? 'text-red-500' : 'text-caption';

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* 메인 반응 버튼 */}
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={pending}
        className={`flex select-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
          myType
            ? `bg-surface font-medium ${currentColor}`
            : 'text-caption hover:bg-surface'
        } disabled:opacity-50`}
      >
        <HeartIcon filled={hasReaction} />
        <span>{totalCount > 0 ? totalCount : ''}</span>
      </button>

      {/* 꾹 누르기 반응 선택 팝업 */}
      {showPicker && (
        <div className="absolute bottom-full left-0 z-50 mb-2 flex gap-1 rounded-full bg-white px-2 py-1.5 shadow-lg ring-1 ring-stroke">
          {REACTION_CONFIG.map(({ type, Icon, label, activeColor }) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              title={label}
              className={`rounded-full p-1.5 transition-transform hover:scale-125 ${
                myType === type ? `bg-surface ${activeColor}` : 'text-caption hover:text-high-emphasis'
              }`}
            >
              <Icon filled={myType === type} />
            </button>
          ))}
        </div>
      )}

      {/* 호버 시 반응 사용자 목록 */}
      {showUsers && !showPicker && totalCount > 0 && (
        <div className="absolute top-full left-0 z-40 mt-1 w-56 rounded-lg bg-white py-1 shadow-lg ring-1 ring-stroke">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-stroke border-t-accent" />
            </div>
          ) : reactionUsers.length === 0 ? (
            <p className="px-3 py-2 text-xs text-low-emphasis">반응 없음</p>
          ) : (
            <ul className="max-h-48 overflow-y-auto">
              {reactionUsers.map((u) => {
                const UserReactionIcon = REACTION_ICON[u.reactionType] ?? HeartIcon;
                const userColor = REACTION_COLOR[u.reactionType] ?? 'text-caption';
                return (
                  <li key={u.userId}>
                    <button
                      onClick={() => navigate(`/feed?userId=${u.userId}`)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-input"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface">
                        {u.profileImageUrl ? (
                          <img
                            src={u.profileImageUrl}
                            alt={u.nickname}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-caption">
                            {u.nickname.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-high-emphasis">
                        {u.nickname}
                      </span>
                      <span className={userColor}>
                        <UserReactionIcon filled />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
