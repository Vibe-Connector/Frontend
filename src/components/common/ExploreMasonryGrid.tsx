import { useState, useRef, useCallback, useEffect } from 'react';

const BATCH_SIZE = 20;

const ASPECT_RATIOS = [
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[1/1]',
  'aspect-[3/2]',
  'aspect-[2/3]',
  'aspect-[4/3]',
  'aspect-[9/16]',
];

function getImageUrl(id: number, width = 600) {
  return `https://picsum.photos/seed/vibe${id}/${width}/${width}`;
}

function getRandomRatio(id: number) {
  return ASPECT_RATIOS[id % ASPECT_RATIOS.length];
}

interface ExploreItem {
  id: number;
  ratio: string;
}

function generateItems(startId: number, count: number): ExploreItem[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return { id, ratio: getRandomRatio(id) };
  });
}

function BookmarkIcon() {
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
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ExploreCard({ item }: { item: ExploreItem }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group mb-4 break-inside-avoid">
      <div
        className={`relative overflow-hidden rounded-card ${!loaded ? item.ratio : ''} bg-surface`}
      >
        <img
          src={getImageUrl(item.id)}
          alt={`Vibe ${item.id}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full rounded-card object-cover transition-transform duration-300 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="pointer-events-none absolute inset-0 rounded-card bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />

        <button
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-high-emphasis opacity-0 shadow-card backdrop-blur-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
          aria-label="북마크"
        >
          <BookmarkIcon />
        </button>
      </div>
    </div>
  );
}

interface ExploreMasonryGridProps {
  seedOffset?: number;
}

export default function ExploreMasonryGrid({
  seedOffset = 1,
}: ExploreMasonryGridProps) {
  const [items, setItems] = useState<ExploreItem[]>(() =>
    generateItems(seedOffset, BATCH_SIZE),
  );
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        ...generateItems(seedOffset + prev.length, BATCH_SIZE),
      ]);
      setLoading(false);
    }, 300);
  }, [seedOffset]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loading]);

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
        {items.map((item) => (
          <ExploreCard key={item.id} item={item} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-8">
        {loading && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stroke border-t-accent" />
        )}
      </div>
    </>
  );
}
