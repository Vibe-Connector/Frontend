import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ReactionBar from '@/components/feed/ReactionBar';
import CommentSection from '@/components/feed/CommentSection';
import BookmarkModal from '@/components/common/BookmarkModal';
import { getFeed } from '@/api/feed';
import { deleteArchiveVibe, deleteArchiveItem } from '@/api/archive';
import { getExploreVibes } from '@/api/explore';
import { getVibeResultItems } from '@/api/vibe';
import type { RecommendedItemResponse } from '@/api/vibe';
import type { ExploreVibeResponse } from '@/api/explore';
import type { FeedResponse, ReactionSummary } from '@/api/types';

/* ---------- Mock Data ---------- */
// [BEFORE INTEGRATION] 하드코딩된 Mock 데이터
// const MOCK_FEED = { id: 'feed-1', user: { nickname: 'Nickname', avatar: '' }, ... };

// [AFTER INTEGRATION] API 실패 시 폴백
const FALLBACK_FEED = {
  id: 'feed-1',
  user: { nickname: 'Nickname', avatar: '' },
  image: 'https://picsum.photos/seed/vibe-main/800/1000',
  description:
    '따뜻한 오후, 빈티지 가구와 식물이 어우러진 아늑한 공간에서 느끼는 편안한 무드. 레트로 감성과 자연의 조화가 만들어낸 나만의 Vibe.',
  moods: ['아늑한', '따뜻한', '레트로'],
  views: 1024,
  items: Array.from({ length: 8 }, (_, i) => ({
    id: `item-${i}`,
    image: `https://picsum.photos/seed/item${i}/200/200`,
    label: ['소파', '조명', '테이블', '러그', '화분', '커피', '음악', '향초'][i],
  })),
};

/* ---------- Icons ---------- */

function UserIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-caption"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* ---------- Component ---------- */

export default function FeedDetail() {
  const { feedId } = useParams<{ feedId: string }>();

  // [BEFORE INTEGRATION] const feed = MOCK_FEED;
  // [AFTER INTEGRATION] API에서 피드 데이터 로드, 실패 시 폴백
  const [feed, setFeed] = useState(FALLBACK_FEED);
  const [apiReactions, setApiReactions] = useState<ReactionSummary[]>([]);
  const [apiMyReactionTypes, setApiMyReactionTypes] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [archiveId, setArchiveId] = useState<number | null>(null);
  const [resultId, setResultId] = useState<number | null>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [vibeItems, setVibeItems] = useState<RecommendedItemResponse[]>([]);
  const [itemBookmarkTarget, setItemBookmarkTarget] = useState<number | null>(null);
  const [itemArchiveMap, setItemArchiveMap] = useState<Record<number, number>>({});
  const [similarBookmarkTarget, setSimilarBookmarkTarget] = useState<{ feedId: number; resultId: number } | null>(null);
  const [similarFeeds, setSimilarFeeds] = useState<ExploreVibeResponse[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarCursor, setSimilarCursor] = useState<string | undefined>();
  const [similarHasNext, setSimilarHasNext] = useState(true);
  const fetchedRef = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!feedId || feedId === 'demo') return;
    if (fetchedRef.current === feedId) return;
    fetchedRef.current = feedId;
    const numId = Number(feedId);
    if (isNaN(numId)) return;

    getFeed(numId)
      .then((res: FeedResponse) => {
        setFeed({
          id: String(res.feedId),
          user: { nickname: res.nickname, avatar: res.profileImageUrl ?? '' },
          image: res.generatedImageUrl ?? FALLBACK_FEED.image,
          description: res.caption ?? res.phrase ?? FALLBACK_FEED.description,
          moods: [],
          views: res.viewCount,
          items: FALLBACK_FEED.items,
        });
        setResultId(res.resultId);
        setApiReactions(res.reactions);
        setApiMyReactionTypes(res.myReactionTypes);
        // 추천 아이템 로드
        getVibeResultItems(res.resultId)
          .then((categories) => {
            const flat = categories.flatMap((c) => c.items);
            setVibeItems(flat);
          })
          .catch(() => {/* 폴백 유지 */});
      })
      .catch(() => {/* 폴백 유지 */});
  }, [feedId]);

  // 비슷한 무드 추천 피드 로드
  const loadSimilarFeeds = useCallback(async (cursor?: string) => {
    setSimilarLoading(true);
    try {
      const res = await getExploreVibes('MONTH', cursor, 12);
      const numId = Number(feedId);
      const filtered = res.content.filter((v) => v.feedId !== numId);
      setSimilarFeeds((prev) => cursor ? [...prev, ...filtered] : filtered);
      setSimilarCursor(res.nextCursor ?? undefined);
      setSimilarHasNext(res.hasNext);
    } catch {
      /* 무시 */
    } finally {
      setSimilarLoading(false);
    }
  }, [feedId]);

  useEffect(() => {
    if (!feedId || feedId === 'demo') return;
    loadSimilarFeeds();
  }, [feedId, loadSimilarFeeds]);

  const numFeedId = Number(feedId);

  return (
    <PageContainer>
      {/* ===== User Profile ===== */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
          {feed.user.avatar ? (
            <img
              src={feed.user.avatar}
              alt={feed.user.nickname}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <span className="text-base font-semibold text-high-emphasis">
          {feed.user.nickname}
        </span>
      </div>

      {/* ===== Main Content (2-column) ===== */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left — Main Image */}
        <div className="shrink-0 lg:w-105">
          <img
            src={feed.image}
            alt="Vibe 메인 이미지"
            className="w-full rounded-card object-cover shadow-card"
          />
        </div>

        {/* Right — Info Panel */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Description */}
          <div className="rounded-card bg-surface p-5">
            <p className="text-sm leading-relaxed text-high-emphasis">
              {feed.description}
            </p>

            {/* Mood Tags */}
            {feed.moods.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {feed.moods.map((mood) => (
                  <span
                    key={mood}
                    className="rounded-pill bg-white px-3 py-1 text-xs font-medium text-caption"
                  >
                    #{mood}
                  </span>
                ))}
              </div>
            )}

            {/* Stats + Actions */}
            <div className="mt-4 flex items-center gap-4 border-t border-stroke pt-4">
              {!isNaN(numFeedId) && (
                <ReactionBar
                  feedId={numFeedId}
                  reactions={apiReactions}
                  myReactionTypes={apiMyReactionTypes}
                />
              )}

              <span className="flex items-center gap-1 text-sm text-caption">
                <EyeIcon />
                <span>{feed.views.toLocaleString()}</span>
              </span>

              <button
                onClick={async () => {
                  if (bookmarked && archiveId) {
                    try {
                      await deleteArchiveVibe(archiveId);
                      setBookmarked(false);
                      setArchiveId(null);
                    } catch { /* 에러 무시 */ }
                  } else if (resultId) {
                    setShowBookmarkModal(true);
                  }
                }}
                className={`ml-auto transition-colors ${bookmarked ? 'text-accent' : 'text-caption hover:text-accent'}`}
                aria-label="북마크"
              >
                <BookmarkIcon filled={bookmarked} />
              </button>
            </div>

            {/* Comments */}
            {!isNaN(numFeedId) && <CommentSection feedId={numFeedId} />}
          </div>

          {/* Recommended Items Grid */}
          <div className="rounded-card bg-surface p-5">
            <div className="grid grid-cols-4 gap-3">
              {(vibeItems.length > 0
                ? vibeItems.slice(0, 8).map((item) => ({
                    key: String(item.itemId),
                    image: item.imageUrl ?? `https://picsum.photos/seed/item${item.itemId}/200/200`,
                    label: item.itemName,
                    itemId: item.itemId,
                  }))
                : feed.items.slice(0, 8).map((item) => ({
                    key: item.id,
                    image: item.image,
                    label: item.label,
                    itemId: null as number | null,
                  }))
              ).map((item) => {
                const isArchived = item.itemId != null && item.itemId in itemArchiveMap;
                return (
                  <div
                    key={item.key}
                    className="group/item relative aspect-square overflow-hidden rounded-control bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover/item:scale-105"
                    />
                    {/* 호버 시 라벨 오버레이 */}
                    <div className="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover/item:opacity-100">
                      <span className="px-2 pb-1.5 text-xs font-medium text-white">
                        {item.label}
                      </span>
                    </div>
                    {/* 호버 시 북마크 버튼 */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (item.itemId == null) return;
                        if (isArchived) {
                          try {
                            await deleteArchiveItem(itemArchiveMap[item.itemId]);
                            setItemArchiveMap((prev) => {
                              const next = { ...prev };
                              delete next[item.itemId!];
                              return next;
                            });
                          } catch { /* 에러 무시 */ }
                        } else {
                          setItemBookmarkTarget(item.itemId);
                        }
                      }}
                      className={`absolute top-1.5 right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 transition-opacity duration-200 ${isArchived ? 'text-accent opacity-100' : 'text-caption opacity-0 hover:text-accent group-hover/item:opacity-100'}`}
                      aria-label="아이템 북마크"
                    >
                      <BookmarkIcon filled={isArchived} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Similar Mood Section ===== */}
      <div className="mt-12">
        <h2 className="mb-6 text-center text-lg font-semibold text-high-emphasis">
          비슷한 무드의 이미지 추천
        </h2>

        {similarFeeds.length === 0 && !similarLoading ? (
          <p className="py-8 text-center text-sm text-low-emphasis">추천 피드가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {similarFeeds.map((vibe) => (
              <div
                key={vibe.feedId}
                onClick={() => navigate(`/feed/${vibe.feedId}`)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-card bg-surface">
                  <img
                    src={vibe.generatedImageUrl ?? `https://picsum.photos/seed/vibe${vibe.feedId}/600/600`}
                    alt={vibe.caption ?? `Vibe ${vibe.feedId}`}
                    loading="lazy"
                    className="w-full rounded-card object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-card bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
                  {/* 호버 시 북마크 버튼 */}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (vibe.isArchived && vibe.archiveId) {
                        try {
                          await deleteArchiveVibe(vibe.archiveId);
                          setSimilarFeeds((prev) =>
                            prev.map((f) => f.feedId === vibe.feedId ? { ...f, isArchived: false, archiveId: null } : f),
                          );
                        } catch { /* 에러 무시 */ }
                      } else {
                        setSimilarBookmarkTarget({ feedId: vibe.feedId, resultId: vibe.resultId });
                      }
                    }}
                    className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 transition-opacity duration-200 ${vibe.isArchived ? 'text-accent opacity-100' : 'text-caption opacity-0 hover:text-accent group-hover:opacity-100'}`}
                    aria-label="북마크"
                  >
                    <BookmarkIcon filled={vibe.isArchived} />
                  </button>
                  {/* 호버 시 정보 오버레이 */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-linear-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="text-white">
                      <p className="truncate text-xs font-medium">{vibe.authorNickname}</p>
                      {vibe.caption && (
                        <p className="mt-0.5 line-clamp-2 text-xs opacity-80">{vibe.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 더보기 버튼 */}
        {similarHasNext && (
          <div className="flex justify-center py-6">
            {similarLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-stroke border-t-accent" />
            ) : (
              <button
                onClick={() => loadSimilarFeeds(similarCursor)}
                className="rounded-control bg-surface px-6 py-2 text-sm font-medium text-caption transition-colors hover:bg-input hover:text-high-emphasis"
              >
                더보기
              </button>
            )}
          </div>
        )}
      </div>
      {/* ===== Vibe Bookmark Modal ===== */}
      {resultId && (
        <BookmarkModal
          open={showBookmarkModal}
          onClose={() => setShowBookmarkModal(false)}
          resultId={resultId}
          onArchived={(id) => {
            setArchiveId(id);
            setBookmarked(true);
          }}
        />
      )}
      {/* ===== Item Bookmark Modal ===== */}
      {itemBookmarkTarget && (
        <BookmarkModal
          open={!!itemBookmarkTarget}
          onClose={() => setItemBookmarkTarget(null)}
          itemId={itemBookmarkTarget}
          onArchived={(archiveItemId) => {
            setItemArchiveMap((prev) => ({ ...prev, [itemBookmarkTarget]: archiveItemId }));
            setItemBookmarkTarget(null);
          }}
        />
      )}
      {/* ===== Similar Feed Bookmark Modal ===== */}
      {similarBookmarkTarget && (
        <BookmarkModal
          open={!!similarBookmarkTarget}
          onClose={() => setSimilarBookmarkTarget(null)}
          resultId={similarBookmarkTarget.resultId}
          onArchived={(newArchiveId) => {
            setSimilarFeeds((prev) =>
              prev.map((f) =>
                f.feedId === similarBookmarkTarget.feedId
                  ? { ...f, isArchived: true, archiveId: newArchiveId }
                  : f,
              ),
            );
            setSimilarBookmarkTarget(null);
          }}
        />
      )}
    </PageContainer>
  );
}
