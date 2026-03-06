import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { ButtonDefault } from '@/components/common';
import { getUserFeeds } from '@/api/feed';
import { getFolders, getPublicFolders } from '@/api/archive';
import { followUser, unfollowUser, getFollowStatus } from '@/api/follow';
import { useAuthStore } from '@/store/authStore';
import FollowListModal from '@/components/follow/FollowListModal';
import type { FeedResponse } from '@/api/types';
import type { FolderResponse } from '@/api/archive';

interface Collection {
  id: string;
  name: string;
  pinCount: number;
  isPrivate: boolean;
  thumbnailUrl: string | null;
  createdAt: string;
  folderType: 'VIBE' | 'ITEM';
}

// --- Icons ---
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
  isOwnProfile,
  followerCount,
  followingCount,
  onFollowerClick,
  onFollowingClick,
}: {
  user: { nickname: string; avatarUrl: string | null; isFollowing: boolean };
  isFollowing: boolean;
  onToggleFollow: () => void;
  isOwnProfile: boolean;
  followerCount: number;
  followingCount: number;
  onFollowerClick: () => void;
  onFollowingClick: () => void;
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
      <div className="flex flex-col">
        <span className="text-[16px] font-medium text-high-emphasis">{user.nickname}</span>
        <span className="text-sm text-caption">
          <button type="button" onClick={onFollowerClick} className="hover:underline">
            팔로워 <strong>{followerCount}</strong>
          </button>
          {' · '}
          <button type="button" onClick={onFollowingClick} className="hover:underline">
            팔로잉 <strong>{followingCount}</strong>
          </button>
        </span>
      </div>
      {!isOwnProfile && (
        <ButtonDefault shape="pill" className="ml-auto px-5! py-2! text-[14px]!" onClick={onToggleFollow}>
          {isFollowing ? '팔로잉' : '팔로우'}
        </ButtonDefault>
      )}
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

type ArchiveFilter = 'ALL' | 'VIBE' | 'ITEM';

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const VISIBLE_COUNT = 5;

function CollectionsSection({
  collections,
  onCollectionClick,
  onCreateClick,
  isOwnProfile,
}: {
  collections: Collection[];
  onCollectionClick: (col: Collection) => void;
  onCreateClick: () => void;
  isOwnProfile: boolean;
}) {
  const [filter, setFilter] = useState<ArchiveFilter>('ALL');
  const [startIndex, setStartIndex] = useState(0);

  const filtered = filter === 'ALL' ? collections : collections.filter((c) => c.folderType === filter);

  // 필터 변경 시 시작 인덱스 초기화
  const handleFilterChange = (key: ArchiveFilter) => {
    setFilter(key);
    setStartIndex(0);
  };

  // "만들기" 카드도 포함한 전체 아이템 수
  const totalItems = filtered.length + (isOwnProfile ? 1 : 0);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + VISIBLE_COUNT < totalItems;

  const visibleCollections = filtered.slice(startIndex, startIndex + VISIBLE_COUNT);
  // "만들기" 카드가 현재 윈도우에 포함되는지 계산
  const createCardIndex = filtered.length; // 만들기 카드의 가상 인덱스
  const showCreateCard = isOwnProfile && createCardIndex >= startIndex && createCardIndex < startIndex + VISIBLE_COUNT;

  const tabs: { key: ArchiveFilter; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: 'VIBE', label: 'Vibe' },
    { key: 'ITEM', label: 'Item' },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-high-emphasis">Archives</h2>
      </div>

      {/* 필터 탭 */}
      <div className="mb-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleFilterChange(tab.key)}
            className={`rounded-pill px-3 py-1 text-[13px] font-medium transition-colors ${
              filter === tab.key
                ? 'bg-high-emphasis text-white'
                : 'border border-stroke text-caption hover:text-high-emphasis'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 폴더 목록 */}
      {filtered.length > 0 ? (
        <div className="flex items-center gap-2">
          {/* 좌측 화살표 */}
          <button
            type="button"
            onClick={() => setStartIndex((i) => Math.max(i - VISIBLE_COUNT, 0))}
            disabled={!canGoPrev}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stroke transition-colors ${
              canGoPrev ? 'cursor-pointer text-high-emphasis hover:bg-surface' : 'invisible'
            }`}
          >
            <ChevronLeftIcon />
          </button>

          <div className="flex min-w-0 flex-1 gap-5">
            {visibleCollections.map((col) => (
              <CollectionCard key={col.id} collection={col} onClick={() => onCollectionClick(col)} />
            ))}
            {showCreateCard && <CreateCollectionCard onClick={onCreateClick} />}
          </div>

          {/* 우측 화살표 */}
          <button
            type="button"
            onClick={() => setStartIndex((i) => Math.min(i + VISIBLE_COUNT, totalItems - VISIBLE_COUNT))}
            disabled={!canGoNext}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stroke transition-colors ${
              canGoNext ? 'cursor-pointer text-high-emphasis hover:bg-surface' : 'invisible'
            }`}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-caption">
          <p className="text-sm">아카이브 폴더가 없습니다</p>
          {isOwnProfile && (
            <button type="button" onClick={onCreateClick} className="mt-2 text-sm text-accent hover:underline">
              폴더 만들기
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function Feed() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId')
    ? Number(searchParams.get('userId'))
    : authUser?.userId;

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
    if (!targetUserId) return;
    const isInitial = !cursor;
    if (isInitial) setFeedLoading(true);
    else setFeedLoadingMore(true);

    getUserFeeds(targetUserId, cursor, 20)
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
  }, [targetUserId]);

  useEffect(() => {
    fetchFeeds();

    const folderPromise = isOwnProfile
      ? getFolders()
      : targetUserId
        ? getPublicFolders(targetUserId)
        : getFolders();

    folderPromise
      .then((folders: FolderResponse[]) => {
        const mapped: Collection[] = folders.map((f) => ({
          id: String(f.folderId),
          name: f.folderName,
          pinCount: f.archiveCount,
          isPrivate: f.isPublic === false,
          thumbnailUrl: f.thumbnailUrl,
          createdAt: new Date(f.createdAt).toLocaleDateString('ko-KR'),
          folderType: (f.folderType === 'ITEM' ? 'ITEM' : 'VIBE') as 'VIBE' | 'ITEM',
        }));
        setCollections(mapped.length > 0 ? mapped : []);
      })
      .catch(() => setCollections([]));

    // 팔로우 상태 초기화
    if (targetUserId) {
      getFollowStatus(targetUserId)
        .then((res) => {
          setIsFollowing(res.following);
          setFollowerCount(res.followerCount);
          setFollowingCount(res.followingCount);
        })
        .catch(() => {});
    }
  }, [fetchFeeds, targetUserId]);

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

  const isOwnProfile = !searchParams.get('userId') || targetUserId === authUser?.userId;
  const feedOwner = !isOwnProfile && feeds.length > 0 ? feeds[0] : null;
  const user = {
    nickname: feedOwner?.nickname ?? authUser?.nickname ?? 'Nickname',
    avatarUrl: feedOwner?.profileImageUrl ?? authUser?.profileImageUrl ?? null,
    isFollowing,
  };

  const handleToggleFollow = useCallback(async () => {
    if (!targetUserId) return;
    const prevFollowing = isFollowing;
    const prevFollowerCount = followerCount;

    // optimistic update
    setIsFollowing(!prevFollowing);
    setFollowerCount(prevFollowing ? prevFollowerCount - 1 : prevFollowerCount + 1);

    try {
      const res = prevFollowing ? await unfollowUser(targetUserId) : await followUser(targetUserId);
      setIsFollowing(res.following);
      setFollowerCount(res.followerCount);
      setFollowingCount(res.followingCount);
    } catch {
      // 롤백
      setIsFollowing(prevFollowing);
      setFollowerCount(prevFollowerCount);
    }
  }, [targetUserId, isFollowing, followerCount]);

  return (
    <PageContainer>
      {/* Profile Section */}
      <ProfileSection
        user={user}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
        isOwnProfile={isOwnProfile}
        followerCount={followerCount}
        followingCount={followingCount}
        onFollowerClick={() => setShowFollowModal('followers')}
        onFollowingClick={() => setShowFollowModal('following')}
      />

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
        onCollectionClick={(col) => navigate(`/archive/${col.id}`, { state: { folderType: col.folderType, folderName: col.name, ...(isOwnProfile ? {} : { ownerUserId: targetUserId }) } })}
        onCreateClick={() => navigate('/archive')}
        isOwnProfile={isOwnProfile}
      />

      {/* Follow List Modal */}
      {targetUserId && (
        <FollowListModal
          open={showFollowModal !== null}
          onClose={() => setShowFollowModal(null)}
          userId={targetUserId}
          initialTab={showFollowModal ?? 'followers'}
        />
      )}
    </PageContainer>
  );
}
