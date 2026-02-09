import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';

/* ---------- Mock Data ---------- */

const MOCK_FEED = {
  id: 'feed-1',
  user: { nickname: 'Nickname', avatar: '' },
  image: 'https://picsum.photos/seed/vibe-main/800/1000',
  description:
    '따뜻한 오후, 빈티지 가구와 식물이 어우러진 아늑한 공간에서 느끼는 편안한 무드. 레트로 감성과 자연의 조화가 만들어낸 나만의 Vibe.',
  moods: ['아늑한', '따뜻한', '레트로'],
  likes: 128,
  dislikes: 3,
  views: 1024,
  comments: [
    { id: 'c1', user: 'user_a', text: '분위기 너무 좋다!', time: '2시간 전' },
    {
      id: 'c2',
      user: 'user_b',
      text: '이런 공간에서 일하고 싶어요',
      time: '1시간 전',
    },
    { id: 'c3', user: 'user_c', text: '조명이 예술이네', time: '30분 전' },
  ],
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

function HeartIcon({ filled }: { filled?: boolean }) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ThumbDownIcon() {
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
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
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
  const feed = MOCK_FEED;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');

  return (
    <PageContainer>
      {/* ===== User Profile ===== */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
          <UserIcon />
        </div>
        <span className="text-base font-semibold text-high-emphasis">
          {feed.user.nickname}
        </span>
      </div>

      {/* ===== Main Content (2-column) ===== */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left — Main Image */}
        <div className="flex-shrink-0 lg:w-[420px]">
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

            {/* Stats + Actions */}
            <div className="mt-4 flex items-center gap-4 border-t border-stroke pt-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1 text-sm transition-colors ${liked ? 'text-accent' : 'text-caption hover:text-accent'}`}
              >
                <HeartIcon filled={liked} />
                <span>{feed.likes + (liked ? 1 : 0)}</span>
              </button>

              <button className="flex items-center gap-1 text-sm text-caption hover:text-high-emphasis">
                <ThumbDownIcon />
                <span>{feed.dislikes}</span>
              </button>

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
            <div className="mt-4 border-t border-stroke pt-4">
              <h3 className="mb-3 text-sm font-semibold text-high-emphasis">
                댓글
              </h3>
              <ul className="space-y-2">
                {feed.comments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-medium text-high-emphasis">
                      {c.user}
                    </span>{' '}
                    <span className="text-high-emphasis">{c.text}</span>
                    <span className="ml-2 text-xs text-low-emphasis">
                      {c.time}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 rounded-control bg-input px-3 py-2 text-sm text-high-emphasis placeholder:text-low-emphasis focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button className="rounded-control bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                  게시
                </button>
              </div>
            </div>
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
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover/item:opacity-100">
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
