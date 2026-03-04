import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { ButtonDefault } from '@/components/common';
import { getUserFeeds } from '@/api/feed';
import { getFolders } from '@/api/archive';
import { useAuthStore } from '@/store/authStore';
import type { FeedResponse } from '@/api/types';
import type { FolderResponse } from '@/api/archive';

interface Collection {
  id: string;
  name: string;
  pinCount: number;
  isPrivate: boolean;
  thumbnailUrl: string | null;
  createdAt: string;
}

const FALLBACK_COLLECTIONS: Collection[] = [
  { id: 'col-1', name: 'MyItems', pinCount: 0, isPrivate: false, thumbnailUrl: null, createdAt: '방금' },
  { id: 'col-2', name: 'MyPlaces', pinCount: 0, isPrivate: true, thumbnailUrl: null, createdAt: '방금' },
];

// --- Icons ---
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// --- Sub Components ---
function ProfileSection({
  user,
  isFollowing,
  onToggleFollow,
}: {
  user: { nickname: string; avatarUrl: string | null; isFollowing: boolean };
  isFollowing: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-stroke text-caption">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.nickname} className="h-full w-full rounded-full object-cover" />
        ) : (
          <UserIcon />
        )}
      </div>
      <span className="text-[16px] font-medium text-high-emphasis">{user.nickname}</span>
      <ButtonDefault shape="pill" className="px-5! py-2! text-[14px]!" onClick={onToggleFollow}>
        {isFollowing ? '팔로잉' : '팔로우'}
      </ButtonDefault>
    </div>
  );
}

function FeedImageSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="aspect-4/5 animate-pulse rounded-control bg-disabled" />
      ))}
    </div>
  );
}

function PhotoGrid({
  feeds,
  onFeedClick,
  hasNext,
  loadingMore,
}: {
  feeds: FeedResponse[];
  onFeedClick: (feedId: number) => void;
  hasNext: boolean;
  loadingMore: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {feeds.map((feed) => (
          <button
            key={feed.feedId}
            type="button"
            className="group relative aspect-4/5 cursor-pointer overflow-hidden rounded-control bg-surface"
            onClick={() => onFeedClick(feed.feedId)}
          >
            <ImageWithFallback
              src={feed.generatedImageUrl}
              alt={feed.caption ?? `Vibe ${feed.feedId}`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              placeholderClassName="flex h-full w-full items-center justify-center bg-disabled text-caption text-xs"
            />
          </button>
        ))}
      </div>
      {hasNext && (
        <div className="mt-4 flex justify-center">
          {loadingMore ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-stroke border-t-accent" />
          ) : null}
        </div>
      )}
    </>
  );
}

function CollectionCard({ collection, onClick }: { collection: Collection; onClick: () => void }) {
  return (
    <button type="button" className="w-45 cursor-pointer text-left" onClick={onClick}>
      <div className="relative flex h-32.5 w-full items-center justify-center overflow-hidden rounded-card bg-surface">
        {collection.thumbnailUrl ? (
          <img src={collection.thumbnailUrl} alt={collection.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-px p-4 opacity-30">
            <div className="rounded-sm bg-stroke" />
            <div className="rounded-sm bg-stroke" />
            <div className="rounded-sm bg-stroke" />
            <div className="rounded-sm bg-stroke" />
          </div>
        )}
        {collection.isPrivate && (
          <div className="absolute top-2 left-2 text-caption"><LockIcon /></div>
        )}
      </div>
      <p className="mt-2 text-[14px] font-semibold text-high-emphasis">{collection.name}</p>
      <p className="text-[12px] text-caption">핀 {collection.pinCount}개 &middot; {collection.createdAt}</p>
    </button>
  );
}

function CreateCollectionCard({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="w-45 cursor-pointer text-left" onClick={onClick}>
      <div className="flex h-32.5 w-full items-center justify-center overflow-hidden rounded-card bg-surface transition-colors hover:bg-disabled">
        <span className="rounded-control border border-stroke bg-white px-4 py-1.5 text-[13px] font-medium text-high-emphasis">만들기</span>
      </div>
      <p className="mt-2 text-[14px] font-semibold text-transparent">&nbsp;</p>
      <p className="text-[12px] text-transparent">&nbsp;</p>
    </button>
  );
}

function CollectionsSection({
  collections,
  onCollectionClick,
  onCreateClick,
}: {
  collections: Collection[];
  onCollectionClick: (id: string) => void;
  onCreateClick: () => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-high-emphasis transition-colors hover:bg-surface" aria-label="필터">
          <FilterIcon />
        </button>
        <span className="rounded-pill border border-stroke px-3 py-1 text-[13px] font-medium text-high-emphasis">그룹</span>
      </div>
      <div className="flex gap-5">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} onClick={() => onCollectionClick(col.id)} />
        ))}
        <CreateCollectionCard onClick={onCreateClick} />
      </div>
    </div>
  );
}

// --- Main Component ---
export default function Feed() {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);

  // Feed 데이터 — cursor pagination
  const [feeds, setFeeds] = useState<FeedResponse[]>([]);
  const [feedCursor, setFeedCursor] = useState<string | null>(null);
  const [feedHasNext, setFeedHasNext] = useState(false);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedLoadingMore, setFeedLoadingMore] = useState(false);
  const feedSentinelRef = useRef<HTMLDivElement>(null);

  // Collections (archive folders)
  const [collections, setCollections] = useState<Collection[]>([]);

  const fetchFeeds = useCallback((cursor?: string) => {
    if (!authUser?.userId) return;
    const isInitial = !cursor;
    if (isInitial) setFeedLoading(true);
    else setFeedLoadingMore(true);

    getUserFeeds(authUser.userId, cursor, 20)
      .then((res) => {
        setFeeds((prev) => (isInitial ? res.content : [...prev, ...res.content]));
        setFeedCursor(res.nextCursor);
        setFeedHasNext(res.hasNext);
      })
      .catch(() => {
        if (isInitial) setFeeds([]);
      })
      .finally(() => {
        if (isInitial) setFeedLoading(false);
        else setFeedLoadingMore(false);
      });
  }, [authUser?.userId]);

  useEffect(() => {
    fetchFeeds();

    getFolders()
      .then((folders: FolderResponse[]) => {
        const mapped: Collection[] = folders.map((f) => ({
          id: String(f.folderId),
          name: f.folderName,
          pinCount: f.archiveCount,
          isPrivate: false,
          thumbnailUrl: f.thumbnailUrl,
          createdAt: new Date(f.createdAt).toLocaleDateString('ko-KR'),
        }));
        setCollections(mapped.length > 0 ? mapped : FALLBACK_COLLECTIONS);
      })
      .catch(() => setCollections(FALLBACK_COLLECTIONS));
  }, [fetchFeeds]);

  // 무한스크롤 for feeds
  useEffect(() => {
    const sentinel = feedSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && feedHasNext && !feedLoadingMore && feedCursor) {
          fetchFeeds(feedCursor);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [feedHasNext, feedLoadingMore, feedCursor, fetchFeeds]);

  const user = {
    nickname: authUser?.nickname ?? 'Nickname',
    avatarUrl: authUser?.profileImageUrl ?? null,
    isFollowing,
  };

  return (
    <PageContainer>
      {/* Profile Section */}
      <ProfileSection user={user} isFollowing={isFollowing} onToggleFollow={() => setIsFollowing((prev) => !prev)} />

      {/* Photo Grid */}
      <section className="mt-6">
        {feedLoading ? (
          <FeedImageSkeleton />
        ) : feeds.length > 0 ? (
          <PhotoGrid feeds={feeds} onFeedClick={(id) => navigate(`/feed/${id}`)} hasNext={feedHasNext} loadingMore={feedLoadingMore} />
        ) : (
          <p className="py-12 text-center text-sm text-caption">아직 게시된 피드가 없습니다</p>
        )}
        <div ref={feedSentinelRef} />
      </section>

      {/* Divider */}
      <hr className="my-10 border-stroke" />

      {/* Collections Section */}
      <CollectionsSection
        collections={collections}
        onCollectionClick={(id) => navigate(`/archive/${id}`)}
        onCreateClick={() => navigate('/archive')}
      />
    </PageContainer>
  );
}
