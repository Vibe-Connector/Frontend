import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';
import ReactionBar from '@/components/feed/ReactionBar';
import CommentSection from '@/components/feed/CommentSection';
import { getFeed } from '@/api/feed';
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
  const fetchedRef = useRef<string | null>(null);

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
        setApiReactions(res.reactions);
        setApiMyReactionTypes(res.myReactionTypes);
      })
      .catch(() => {/* 폴백 유지 */});
  }, [feedId]);

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
                onClick={() => setBookmarked(!bookmarked)}
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
              {feed.items.slice(0, 7).map((item) => (
                <div
                  key={item.id}
                  className="group/item relative aspect-square overflow-hidden rounded-control bg-white"
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover/item:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover/item:opacity-100">
                    <span className="px-2 pb-1.5 text-xs font-medium text-white">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}

              {/* Placeholder card */}
              <div className="col-span-1 row-span-2 flex items-center justify-center rounded-control bg-disabled/60">
                <span className="text-center text-xs text-low-emphasis">
                  추천 아이템
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Similar Mood Section ===== */}
      <div className="mt-12">
        <h2 className="mb-6 text-center text-lg font-semibold text-high-emphasis">
          비슷한 무드의 이미지 추천
        </h2>
        <ExploreMasonryGrid seedOffset={100} />
      </div>
    </PageContainer>
  );
}
