import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import BookmarkModal from '@/components/common/BookmarkModal';
import { getExploreVibes } from '@/api/explore';
import type { ExploreVibeResponse, ExplorePeriod } from '@/api/explore';
import { deleteArchiveVibe } from '@/api/archive';
import { useAuthStore } from '@/store/authStore';

const PERIOD_TABS: { key: ExplorePeriod; label: string }[] = [
  { key: 'DAY', label: 'Today' },
  { key: 'WEEK', label: 'This Week' },
  { key: 'MONTH', label: 'This Month' },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <div className="animate-pulse overflow-hidden rounded-card bg-surface">
            <div className="aspect-3/4 bg-disabled" />
            <div className="space-y-1.5 p-2">
              <div className="h-3 w-16 rounded bg-disabled" />
              <div className="h-3 w-24 rounded bg-disabled" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 책갈피 아이콘 (빈) */
function BookmarkOutlineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* 책갈피 아이콘 (채움) */
function BookmarkFilledIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const periodParam = searchParams.get('period') as ExplorePeriod | null;
  const period: ExplorePeriod = periodParam && ['DAY', 'WEEK', 'MONTH'].includes(periodParam) ? periodParam : 'WEEK';
  const [vibes, setVibes] = useState<ExploreVibeResponse[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // BookmarkModal state
  const [bookmarkTarget, setBookmarkTarget] = useState<{ resultId: number; feedId: number } | null>(null);

  // 기간 변경 또는 초기 로드 — setState는 비동기 콜백 안에서만 호출
  useEffect(() => {
    let cancelled = false;

    getExploreVibes(period, undefined, 20)
      .then((res) => {
        if (cancelled) return;
        setVibes(res.content);
        setNextCursor(res.nextCursor);
        setHasNext(res.hasNext);
        setApiFailed(false);
      })
      .catch(() => {
        if (cancelled) return;
        setVibes([]);
        setApiFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [period]);

  // 무한스크롤 추가 로드
  const fetchMore = useCallback(() => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    getExploreVibes(period, nextCursor, 20)
      .then((res) => {
        setVibes((prev) => [...prev, ...res.content]);
        setNextCursor(res.nextCursor);
        setHasNext(res.hasNext);
      })
      .catch(() => { /* 추가 로드 실패 무시 */ })
      .finally(() => setLoadingMore(false));
  }, [period, nextCursor, loadingMore]);

  // 무한스크롤
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loadingMore && nextCursor) {
          fetchMore();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNext, loadingMore, nextCursor, fetchMore]);

  const handleCardClick = (feedId: number) => {
    navigate(`/feed/${feedId}`);
  };

  const handlePeriodChange = (newPeriod: ExplorePeriod) => {
    if (newPeriod === period) return;
    setLoading(true);
    setSearchParams({ period: newPeriod }, { replace: true });
  };

  const handleBookmarkClick = async (e: React.MouseEvent, vibe: ExploreVibeResponse) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // 이미 아카이브된 경우 → 해제
    if (vibe.isArchived && vibe.archiveId) {
      try {
        await deleteArchiveVibe(vibe.archiveId);
        setVibes((prev) =>
          prev.map((v) =>
            v.feedId === vibe.feedId
              ? { ...v, isArchived: false, archiveId: null }
              : v,
          ),
        );
      } catch {
        // TODO: 에러 토스트
      }
      return;
    }
    // 아카이브 안 된 경우 → 폴더 선택 모달
    setBookmarkTarget({ resultId: vibe.resultId, feedId: vibe.feedId });
  };

  const handleArchived = (archiveId: number) => {
    if (!bookmarkTarget) return;
    setVibes((prev) =>
      prev.map((v) =>
        v.feedId === bookmarkTarget.feedId
          ? { ...v, isArchived: true, archiveId }
          : v,
      ),
    );
  };

  return (
    <PageContainer>
      {/* 기간 필터 탭 */}
      <div className="mb-6 flex gap-2">
        {PERIOD_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handlePeriodChange(tab.key)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
              period === tab.key
                ? 'bg-brand text-white'
                : 'bg-surface text-caption hover:text-high-emphasis'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 영역 */}
      {loading ? (
        <SkeletonGrid />
      ) : apiFailed || vibes.length === 0 ? (
        <>
          {vibes.length === 0 && !apiFailed && (
            <p className="mb-4 text-center text-sm text-caption">
              이 기간에 인기 Vibe가 없습니다
            </p>
          )}
          <ExploreMasonryGrid />
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {vibes.map((vibe) => (
              <div key={vibe.feedId}>
                <div
                  role="button"
                  tabIndex={0}
                  className="group relative w-full cursor-pointer text-left"
                  onClick={() => handleCardClick(vibe.feedId)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(vibe.feedId); }}
                >
                  <div className="overflow-hidden rounded-card bg-surface transition-shadow hover:shadow-card">
                    {/* 이미지 + 책갈피 버튼 */}
                    <div className="relative">
                      <ImageWithFallback
                        src={vibe.generatedImageUrl}
                        alt={vibe.caption ?? 'Vibe'}
                        className="aspect-3/4 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* 책갈피 버튼 */}
                      <div
                        className={`absolute top-2 right-2 transition-opacity ${
                          vibe.isArchived
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleBookmarkClick(e, vibe)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                            vibe.isArchived
                              ? 'bg-brand/80 text-white'
                              : 'bg-black/30 text-white hover:bg-black/50'
                          }`}
                          aria-label={vibe.isArchived ? '아카이브됨' : '아카이브에 저장'}
                        >
                          {vibe.isArchived ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
                        </button>
                      </div>

                    </div>

                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-high-emphasis">
                        {vibe.authorNickname}
                      </p>
                      {vibe.caption && (
                        <p className="mt-1 truncate text-xs text-caption">
                          {vibe.caption}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-low-emphasis">
                        <span>{vibe.viewCount} views</span>
                        <span>{vibe.reactionCount} reactions</span>
                        <span>{vibe.commentCount} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 무한스크롤 sentinel */}
          <div ref={sentinelRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-stroke border-t-accent" />
            )}
          </div>
        </>
      )}

      {/* BookmarkModal */}
      {bookmarkTarget && (
        <BookmarkModal
          open={!!bookmarkTarget}
          onClose={() => setBookmarkTarget(null)}
          resultId={bookmarkTarget.resultId}
          onArchived={handleArchived}
        />
      )}
    </PageContainer>
  );
}
