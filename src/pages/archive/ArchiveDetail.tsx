import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import {
  getArchiveVibes,
  getArchiveItems,
  getPublicFolderVibes,
  getPublicFolderItems,
  toggleVibeFavorite,
  toggleItemFavorite,
  deleteArchiveVibe,
  deleteArchiveItem,
} from '@/api/archive';
import type { ArchiveVibeResponse, ArchiveItemResponse } from '@/api/archive';
import ItemDetailModal from '@/components/common/ItemDetailModal';

// ── SVG 아이콘 ──

function PinIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ── 삭제 확인 모달 ──

function UnbookmarkModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-xs rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-center text-base font-semibold text-high-emphasis">
          책갈피 해제
        </h3>
        <p className="mt-2 text-center text-sm text-caption">
          이 폴더에서 제거하시겠습니까?
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-disabled px-4 py-2.5 text-sm font-medium text-high-emphasis transition-colors hover:bg-disabled/80"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            해제
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Vibe 카드 ──

function VibeCard({
  vibe,
  onToggleFavorite,
  onDelete,
  onClick,
  readOnly,
}: {
  vibe: ArchiveVibeResponse & { _favorite: boolean };
  onToggleFavorite: (archiveId: number) => void;
  onDelete: (archiveId: number) => void;
  onClick: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="group mb-4 break-inside-avoid">
      <div className="overflow-hidden rounded-card bg-surface">
        <div className={vibe.feedId ? 'cursor-pointer' : ''} onClick={onClick}>
          {vibe.generatedImageUrl ? (
            <img
              src={vibe.generatedImageUrl}
              alt={vibe.phrase ?? 'Archived Vibe'}
              className="w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-disabled text-caption">
              No Image
            </div>
          )}
        </div>

        <div className="p-3">
          {vibe.phrase && (
            <p className="line-clamp-2 text-sm font-medium text-high-emphasis">
              {vibe.phrase}
            </p>
          )}
          {vibe.memo && (
            <p className="mt-1 line-clamp-2 text-xs text-caption">{vibe.memo}</p>
          )}

          {/* 액션 버튼 — 읽기 전용 시 숨김 */}
          {!readOnly && (
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDelete(vibe.archiveId)}
                className="rounded-full p-1 text-accent transition-colors hover:text-accent/70"
                aria-label="책갈피 해제"
              >
                <BookmarkIcon filled />
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite(vibe.archiveId)}
                className={`rounded-full p-1 transition-all ${vibe._favorite ? 'opacity-100 text-accent' : 'opacity-0 text-caption group-hover:opacity-100 hover:text-accent/70'}`}
                aria-label={vibe._favorite ? '즐겨찾기 해제' : '즐겨찾기'}
              >
                <PinIcon filled={vibe._favorite} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Item 카드 ──

function ItemCard({
  item,
  onToggleFavorite,
  onDelete,
  onClick,
  readOnly,
}: {
  item: ArchiveItemResponse & { _favorite: boolean };
  onToggleFavorite: (archiveItemId: number) => void;
  onDelete: (archiveItemId: number) => void;
  onClick?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="group mb-4 break-inside-avoid cursor-pointer" onClick={onClick}>
      <div className="overflow-hidden rounded-card bg-surface">
        {item.imageUrl ? (
          <div className="relative aspect-square overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.itemName ?? 'Archived Item'}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {/* 카테고리 배지 */}
            <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
              {item.categoryKey}
            </span>
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center bg-disabled text-caption">
            No Image
          </div>
        )}

        <div className="p-3">
          {item.itemName && (
            <p className="truncate text-sm font-medium text-high-emphasis">
              {item.itemName}
            </p>
          )}
          {item.brand && (
            <p className="truncate text-xs text-caption">{item.brand}</p>
          )}
          {item.memo && (
            <p className="mt-1 line-clamp-2 text-xs text-caption">{item.memo}</p>
          )}

          {/* 액션 버튼 — 읽기 전용 시 숨김 */}
          {!readOnly && (
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(item.archiveItemId); }}
                className="rounded-full p-1 text-accent transition-colors hover:text-accent/70"
                aria-label="책갈피 해제"
              >
                <BookmarkIcon filled />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.archiveItemId); }}
                className={`rounded-full p-1 transition-all ${item._favorite ? 'opacity-100 text-accent' : 'opacity-0 text-caption group-hover:opacity-100 hover:text-accent/70'}`}
                aria-label={item._favorite ? '즐겨찾기 해제' : '즐겨찾기'}
              >
                <PinIcon filled={item._favorite} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──

export default function ArchiveDetail() {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { folderType?: string; folderName?: string; ownerUserId?: number } | null;

  const folderType: 'VIBE' | 'ITEM' = state?.folderType === 'ITEM' ? 'ITEM' : 'VIBE';
  const ownerUserId = state?.ownerUserId ?? null;
  const isReadOnly = ownerUserId !== null;
  const [folderName, setFolderName] = useState(state?.folderName ?? '');

  // ── Vibe 상태 ──
  const [vibes, setVibes] = useState<(ArchiveVibeResponse & { _favorite: boolean })[]>([]);
  const [vibeCursor, setVibeCursor] = useState<string | null>(null);
  const [vibeHasNext, setVibeHasNext] = useState(false);
  const [vibeLoading, setVibeLoading] = useState(false);

  // ── Item 상태 ──
  const [items, setItems] = useState<(ArchiveItemResponse & { _favorite: boolean })[]>([]);
  const [itemCursor, setItemCursor] = useState<string | null>(null);
  const [itemHasNext, setItemHasNext] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{ itemId: number; categoryKey: string } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── 정렬 ──
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // ── 삭제 모달 상태 ──
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'vibe' | 'item'; id: number } | null>(null);

  const numId = Number(folderId);
  const isValidId = !isNaN(numId);

  // ── Vibe 데이터 로드 ──
  const fetchVibes = useCallback(
    (cursor?: string) => {
      if (!isValidId || vibeLoading) return;
      setVibeLoading(true);
      const request = ownerUserId
        ? getPublicFolderVibes(ownerUserId, numId, cursor)
        : getArchiveVibes(numId, cursor);
      request
        .then((res) => {
          const mapped = res.content.map((v) => ({ ...v, _favorite: v.isFavorite }));
          setVibes((prev) => (cursor ? [...prev, ...mapped] : mapped));
          setVibeCursor(res.nextCursor);
          setVibeHasNext(res.hasNext);
          if (!cursor && res.content.length > 0 && res.content[0].folderName && !state?.folderName) {
            setFolderName(res.content[0].folderName);
          }
        })
        .catch(() => {})
        .finally(() => {
          setVibeLoading(false);
          setInitialLoading(false);
        });
    },
    [isValidId, numId, vibeLoading, state?.folderName, ownerUserId],
  );

  // ── Item 데이터 로드 ──
  const fetchItems = useCallback(
    (cursor?: string) => {
      if (!isValidId || itemLoading) return;
      setItemLoading(true);
      const request = ownerUserId
        ? getPublicFolderItems(ownerUserId, numId, cursor)
        : getArchiveItems(numId, cursor);
      request
        .then((res) => {
          const mapped = res.content.map((i) => ({ ...i, _favorite: i.isFavorite }));
          setItems((prev) => (cursor ? [...prev, ...mapped] : mapped));
          setItemCursor(res.nextCursor);
          setItemHasNext(res.hasNext);
          if (!cursor && res.content.length > 0 && res.content[0].folderName && !state?.folderName) {
            setFolderName(res.content[0].folderName);
          }
        })
        .catch(() => {})
        .finally(() => {
          setItemLoading(false);
          setInitialLoading(false);
        });
    },
    [isValidId, numId, itemLoading, state?.folderName, ownerUserId],
  );

  // ── 초기 로드 ──
  useEffect(() => {
    if (!isValidId) {
      setInitialLoading(false);
      return;
    }
    if (folderType === 'VIBE') {
      fetchVibes();
    } else {
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, folderType]);

  // ── 무한 스크롤 ──
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (folderType === 'VIBE' && vibeHasNext && !vibeLoading && vibeCursor) {
          fetchVibes(vibeCursor);
        } else if (folderType === 'ITEM' && itemHasNext && !itemLoading && itemCursor) {
          fetchItems(itemCursor);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [folderType, vibeHasNext, vibeLoading, vibeCursor, itemHasNext, itemLoading, itemCursor, fetchVibes, fetchItems]);

  // ── 즐겨찾기 토글 ──
  const handleVibeToggleFavorite = (archiveId: number) => {
    toggleVibeFavorite(archiveId)
      .then((res) => {
        setVibes((prev) =>
          prev.map((v) => (v.archiveId === archiveId ? { ...v, _favorite: res.favorited } : v)),
        );
      })
      .catch(() => {});
  };

  const handleItemToggleFavorite = (archiveItemId: number) => {
    toggleItemFavorite(archiveItemId)
      .then((res) => {
        setItems((prev) =>
          prev.map((i) => (i.archiveItemId === archiveItemId ? { ...i, _favorite: res.favorited } : i)),
        );
      })
      .catch(() => {});
  };

  // ── 삭제 ──
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'vibe') {
      deleteArchiveVibe(deleteTarget.id)
        .then(() => setVibes((prev) => prev.filter((v) => v.archiveId !== deleteTarget.id)))
        .catch(() => {});
    } else {
      deleteArchiveItem(deleteTarget.id)
        .then(() => setItems((prev) => prev.filter((i) => i.archiveItemId !== deleteTarget.id)))
        .catch(() => {});
    }
    setDeleteTarget(null);
  };

  // ── 정렬된 데이터 ──
  const sortedVibes = sortOrder === 'OLDEST' ? [...vibes].reverse() : vibes;
  const sortedItems = sortOrder === 'OLDEST' ? [...items].reverse() : items;

  // ── 빈 상태 ──
  const isEmpty = folderType === 'VIBE' ? vibes.length === 0 : items.length === 0;
  const isLoading = folderType === 'VIBE' ? vibeLoading : itemLoading;

  return (
    <PageContainer>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-1px] text-high-emphasis">
            {folderName || 'Archive'}
          </h1>
          <p className="mt-1 text-sm text-caption">
            {folderType === 'VIBE' ? vibes.length : items.length}개 항목
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-full border border-stroke bg-white px-3 py-1 text-xs font-medium text-high-emphasis transition-colors hover:bg-gray-50"
              onClick={() => setShowSortDropdown((v) => !v)}
            >
              {sortOrder === 'NEWEST' ? '최신순' : '오래된순'}
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </button>
            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 z-20 mt-1 w-28 overflow-hidden rounded-lg border border-stroke bg-white shadow-lg">
                  {(['NEWEST', 'OLDEST'] as const).map((order) => (
                    <button
                      key={order}
                      type="button"
                      className={`w-full cursor-pointer px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 ${sortOrder === order ? 'font-semibold text-high-emphasis' : 'text-default'}`}
                      onClick={() => { setSortOrder(order); setShowSortDropdown(false); }}
                    >
                      {order === 'NEWEST' ? '최신순' : '오래된순'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-caption">
            {folderType === 'VIBE' ? 'Vibe' : 'Item'}
          </span>
        </div>
      </div>

      {/* 로딩 */}
      {initialLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}

      {/* 빈 상태 */}
      {!initialLoading && isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-caption">
          <p className="text-lg font-medium">아직 저장된 항목이 없어요</p>
          <p className="mt-1 text-sm">피드에서 마음에 드는 {folderType === 'VIBE' ? 'Vibe' : '아이템'}를 저장해보세요</p>
        </div>
      )}

      {/* Vibe 그리드 */}
      {!initialLoading && folderType === 'VIBE' && vibes.length > 0 && (
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
          {sortedVibes.map((vibe) => (
            <VibeCard
              key={vibe.archiveId}
              vibe={vibe}
              onToggleFavorite={handleVibeToggleFavorite}
              onDelete={(id) => setDeleteTarget({ type: 'vibe', id })}
              onClick={() => { if (vibe.feedId) navigate(`/feed/${vibe.feedId}`); }}
              readOnly={isReadOnly}
            />
          ))}
        </div>
      )}

      {/* Item 그리드 */}
      {!initialLoading && folderType === 'ITEM' && items.length > 0 && (
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4">
          {sortedItems.map((item) => (
            <ItemCard
              key={item.archiveItemId}
              item={item}
              onToggleFavorite={handleItemToggleFavorite}
              onDelete={(id) => setDeleteTarget({ type: 'item', id })}
              onClick={() => setSelectedItem({ itemId: item.itemId, categoryKey: item.categoryKey })}
              readOnly={isReadOnly}
            />
          ))}
        </div>
      )}

      {/* 무한 스크롤 센티넬 */}
      <div ref={sentinelRef} className="h-1" />

      {/* 추가 로딩 */}
      {isLoading && !initialLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <UnbookmarkModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ===== Item Detail Modal ===== */}
      {selectedItem && (
        <ItemDetailModal
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          itemId={selectedItem.itemId}
          categoryKey={selectedItem.categoryKey}
        />
      )}
    </PageContainer>
  );
}
