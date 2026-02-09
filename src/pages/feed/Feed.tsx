import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault } from '@/components/common';

// --- Mock Data ---
const MOCK_USER = {
  nickname: 'Nickname',
  avatarUrl: null as string | null,
  isFollowing: false,
};

const MOCK_FEED_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  id: `feed-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/vibe${i + 1}/400/500`,
  alt: `Vibe ${i + 1}`,
}));

interface Collection {
  id: string;
  name: string;
  pinCount: number;
  isPrivate: boolean;
  thumbnailUrl: string | null;
  createdAt: string;
}

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'MyItems',
    pinCount: 0,
    isPrivate: false,
    thumbnailUrl: null,
    createdAt: '방금',
  },
  {
    id: 'col-2',
    name: 'MyPlaces',
    pinCount: 0,
    isPrivate: true,
    thumbnailUrl: null,
    createdAt: '방금',
  },
];

// --- Icons ---
function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// --- Sub Components ---
function ProfileSection({
  user,
  isFollowing,
  onToggleFollow,
}: {
  user: typeof MOCK_USER;
  isFollowing: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-stroke text-caption">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.nickname}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <UserIcon />
        )}
      </div>
      <span className="text-[16px] font-medium text-high-emphasis">
        {user.nickname}
      </span>
      <ButtonDefault
        shape="pill"
        className="!px-5 !py-2 !text-[14px]"
        onClick={onToggleFollow}
      >
        {isFollowing ? '팔로잉' : '팔로우'}
      </ButtonDefault>
    </div>
  );
}

function PhotoGrid({
  images,
  onImageClick,
}: {
  images: typeof MOCK_FEED_IMAGES;
  onImageClick: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {images.map((img) => (
        <button
          key={img.id}
          type="button"
          className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-control bg-surface"
          onClick={() => onImageClick(img.id)}
        >
          <img
            src={img.imageUrl}
            alt={img.alt}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}

function CollectionCard({
  collection,
  onClick,
}: {
  collection: Collection;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="w-[180px] cursor-pointer text-left"
      onClick={onClick}
    >
      <div className="relative flex h-[130px] w-full items-center justify-center overflow-hidden rounded-card bg-surface">
        {collection.thumbnailUrl ? (
          <img
            src={collection.thumbnailUrl}
            alt={collection.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1px] p-4 opacity-30">
            <div className="rounded-sm bg-stroke" />
            <div className="rounded-sm bg-stroke" />
            <div className="rounded-sm bg-stroke" />
            <div className="rounded-sm bg-stroke" />
          </div>
        )}
        {collection.isPrivate && (
          <div className="absolute top-2 left-2 text-caption">
            <LockIcon />
          </div>
        )}
      </div>
      <p className="mt-2 text-[14px] font-semibold text-high-emphasis">
        {collection.name}
      </p>
      <p className="text-[12px] text-caption">
        핀 {collection.pinCount}개 &middot; {collection.createdAt}
      </p>
    </button>
  );
}

function CreateCollectionCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="w-[180px] cursor-pointer text-left"
      onClick={onClick}
    >
      <div className="flex h-[130px] w-full items-center justify-center overflow-hidden rounded-card bg-surface transition-colors hover:bg-disabled">
        <span className="rounded-control border border-stroke bg-white px-4 py-1.5 text-[13px] font-medium text-high-emphasis">
          만들기
        </span>
      </div>
      {/* CollectionCard 하단 텍스트 영역과 높이 맞춤 */}
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
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-high-emphasis transition-colors hover:bg-surface"
          aria-label="필터"
        >
          <FilterIcon />
        </button>
        <span className="rounded-pill border border-stroke px-3 py-1 text-[13px] font-medium text-high-emphasis">
          그룹
        </span>
      </div>
      <div className="flex gap-5">
        {collections.map((col) => (
          <CollectionCard
            key={col.id}
            collection={col}
            onClick={() => onCollectionClick(col.id)}
          />
        ))}
        <CreateCollectionCard onClick={onCreateClick} />
      </div>
    </div>
  );
}

// --- Main Component ---
export default function Feed() {
  const [isFollowing, setIsFollowing] = useState(MOCK_USER.isFollowing);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleImageClick = (id: string) => {
    console.log('Feed image clicked:', id);
  };

  const handleCollectionClick = (id: string) => {
    console.log('Collection clicked:', id);
  };

  const handleCreateCollection = () => {
    console.log('Create collection clicked');
  };

  return (
    <PageContainer>
      {/* Profile Section */}
      <ProfileSection
        user={MOCK_USER}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
      />

      {/* Photo Grid */}
      <section className="mt-6">
        <PhotoGrid images={MOCK_FEED_IMAGES} onImageClick={handleImageClick} />
      </section>

      {/* Divider */}
      <hr className="my-10 border-stroke" />

      {/* Collections Section */}
      <CollectionsSection
        collections={MOCK_COLLECTIONS}
        onCollectionClick={handleCollectionClick}
        onCreateClick={handleCreateCollection}
      />
    </PageContainer>
  );
}
