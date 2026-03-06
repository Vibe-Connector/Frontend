import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PageContainer from '@/components/layout/PageContainer';
import { getFolders, createFolder, updateFolder, deleteFolder, getArchiveVibes, getArchiveItems } from '@/api/archive';
import type { FolderResponse } from '@/api/archive';

type SortMode = 'CREATED' | 'NAME' | 'CUSTOM';
type FilterType = 'ALL' | 'VIBE' | 'ITEM';

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: '전체',
  VIBE: 'Vibe',
  ITEM: 'Item',
};

interface ArchiveFolder {
  id: string;
  numericId: number;
  title: string;
  pinCount: number;
  timeLabel: string;
  isPrivate?: boolean;
  thumbnailUrl?: string | null;
  folderType: string;
  sortOrder: number;
  createdAt: string;
  previewImages: string[];
}

const FALLBACK_FOLDERS: ArchiveFolder[] = [
  { id: '1', numericId: 1, title: 'MyItems', pinCount: 0, timeLabel: '방금', folderType: 'VIBE', sortOrder: 0, createdAt: '', previewImages: [] },
  { id: '2', numericId: 2, title: 'MyPlaces', pinCount: 0, timeLabel: '방금', isPrivate: true, folderType: 'ITEM', sortOrder: 1, createdAt: '', previewImages: [] },
];

function mapFolderResponse(f: FolderResponse): ArchiveFolder {
  return {
    id: String(f.folderId),
    numericId: f.folderId,
    title: f.folderName,
    pinCount: f.archiveCount,
    timeLabel: new Date(f.createdAt).toLocaleDateString('ko-KR'),
    isPrivate: f.isPublic === false,
    thumbnailUrl: f.thumbnailUrl,
    folderType: f.folderType,
    sortOrder: f.sortOrder,
    createdAt: f.createdAt,
    previewImages: [],
  };
}

function sortFolders(folders: ArchiveFolder[], mode: SortMode): ArchiveFolder[] {
  const sorted = [...folders];
  switch (mode) {
    case 'CREATED':
      return sorted.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'NAME':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    case 'CUSTOM':
      return sorted.sort((a, b) => a.sortOrder - b.sortOrder);
    default:
      return sorted;
  }
}

// ── SVG Icons ──

function LockIcon() {
  return (
    <svg className="h-5 w-5 text-high-emphasis" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M5 4a1 1 0 0 1 2 0v9.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L5 13.586V4Zm10 12a1 1 0 1 1-2 0V6.414l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L15 6.414V16Z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
    </svg>
  );
}

function ThumbnailGrid({ images = [] }: { images?: string[] }) {
  const cells = [0, 1, 2, 3];
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
      {cells.map((i) =>
        images[i] ? (
          <img
            key={i}
            src={images[i]}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div key={i} className="bg-disabled" />
        ),
      )}
    </div>
  );
}

// ── Folder Card Content (shared between plain & sortable) ──

function FolderCardContent({
  folder,
  onEdit,
}: {
  folder: ArchiveFolder;
  onEdit?: (e: React.MouseEvent) => void;
}) {
  return (
    <>
      {/* Thumbnail */}
      <div className="group/card relative aspect-square overflow-hidden rounded-card bg-surface">
        {folder.thumbnailUrl ? (
          <img src={folder.thumbnailUrl} alt={folder.title} className="h-full w-full object-cover" />
        ) : (
          <ThumbnailGrid images={folder.previewImages} />
        )}

        {folder.isPrivate && (
          <div className="absolute top-3 left-3">
            <LockIcon />
          </div>
        )}

        {/* Edit button — hover only, bottom-right */}
        {onEdit && (
          <button
            type="button"
            className="absolute right-2 bottom-2 rounded-full bg-white/90 p-1.5 opacity-0 shadow-sm transition-opacity group-hover/card:opacity-100"
            onClick={onEdit}
            aria-label="폴더 수정"
          >
            <EditIcon />
          </button>
        )}
      </div>

      {/* Info */}
      <p className="mt-2 text-[16px] font-semibold tracking-[-1px] text-high-emphasis">
        {folder.title}
      </p>
      <p className="text-[13px] tracking-[-0.5px] text-caption">
        {folder.pinCount}개 항목 · {folder.timeLabel}
      </p>
    </>
  );
}

// ── Plain Folder Card (no DnD context required) ──

function PlainFolderCard({
  folder,
  onClick,
  onEdit,
}: {
  folder: ArchiveFolder;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <FolderCardContent folder={folder} onEdit={onEdit} />
    </div>
  );
}

// ── Sortable Folder Card (must be inside DndContext + SortableContext) ──

function SortableFolderCard({
  folder,
  onClick,
  onEdit,
}: {
  folder: ArchiveFolder;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing"
      onClick={() => {
        if (!isDragging) onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <FolderCardContent folder={folder} onEdit={onEdit} />
    </div>
  );
}

// ── Folder Edit Modal ──

function FolderEditModal({
  folder,
  onClose,
  onRename,
  onDelete,
}: {
  folder: ArchiveFolder;
  onClose: () => void;
  onRename: (newName: string, isPublic: boolean) => void;
  onDelete: () => void;
}) {
  const [editName, setEditName] = useState(folder.title);
  const [isPublic, setIsPublic] = useState(!folder.isPrivate);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleRename = () => {
    const trimmed = editName.trim();
    const publicChanged = isPublic !== !folder.isPrivate;
    if ((!trimmed || trimmed === folder.title) && !publicChanged) {
      onClose();
      return;
    }
    setSaving(true);
    onRename(trimmed || folder.title, isPublic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-80 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {confirmDelete ? (
          <>
            <h3 className="text-lg font-bold text-high-emphasis">폴더 삭제</h3>
            <p className="mt-2 text-sm text-caption">
              "{folder.title}" 폴더를 삭제하시겠습니까?
              <br />
              폴더 내 아카이브는 미분류로 이동됩니다.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-default transition-colors hover:bg-gray-50"
                onClick={() => setConfirmDelete(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                onClick={onDelete}
              >
                삭제
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-high-emphasis">폴더 수정</h3>

            {/* Rename */}
            <label className="mt-4 block text-sm font-medium text-default">폴더 이름</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') onClose();
              }}
              className="mt-1 w-full rounded-lg border border-stroke px-3 py-2 text-sm text-high-emphasis outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              maxLength={100}
              autoFocus
              disabled={saving}
            />

            {/* Public/Private toggle */}
            <label className="mt-3 flex items-center justify-between text-sm font-medium text-default">
              <span>공개 설정</span>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  isPublic ? 'bg-high-emphasis' : 'bg-gray-200'
                }`}
                onClick={() => setIsPublic((v) => !v)}
                disabled={saving}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
            <p className="mt-0.5 text-xs text-caption">
              {isPublic ? '다른 사용자가 이 폴더를 볼 수 있습니다' : '나만 볼 수 있는 비공개 폴더입니다'}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                onClick={() => setConfirmDelete(true)}
              >
                삭제
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg bg-high-emphasis px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                onClick={handleRename}
                disabled={saving || !editName.trim()}
              >
                저장
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Folder Create Modal ──

function FolderCreateModal({
  folderType,
  onClose,
  onCreate,
}: {
  folderType: 'VIBE' | 'ITEM';
  onClose: () => void;
  onCreate: (name: string, type: 'VIBE' | 'ITEM', isPublic: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'VIBE' | 'ITEM'>(folderType);
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    onCreate(trimmed, type, isPublic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-80 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-high-emphasis">새 폴더 만들기</h3>

        <label className="mt-4 block text-sm font-medium text-default">폴더 이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate();
            if (e.key === 'Escape') onClose();
          }}
          className="mt-1 w-full rounded-lg border border-stroke px-3 py-2 text-sm text-high-emphasis outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          placeholder="폴더 이름을 입력하세요"
          maxLength={100}
          autoFocus
          disabled={saving}
        />

        <label className="mt-3 block text-sm font-medium text-default">폴더 유형</label>
        <div className="mt-1 flex gap-2">
          {(['VIBE', 'ITEM'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                type === t
                  ? 'border-high-emphasis bg-high-emphasis text-white'
                  : 'border-stroke text-default hover:bg-gray-50'
              }`}
              onClick={() => setType(t)}
              disabled={saving}
            >
              {t === 'VIBE' ? 'Vibe' : 'Item'}
            </button>
          ))}
        </div>

        <label className="mt-3 flex items-center justify-between text-sm font-medium text-default">
          <span>공개 설정</span>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              isPublic ? 'bg-high-emphasis' : 'bg-gray-200'
            }`}
            onClick={() => setIsPublic((v) => !v)}
            disabled={saving}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                isPublic ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
        <p className="mt-0.5 text-xs text-caption">
          {isPublic ? '다른 사용자가 이 폴더를 볼 수 있습니다' : '나만 볼 수 있는 비공개 폴더입니다'}
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-default transition-colors hover:bg-gray-50"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-lg bg-high-emphasis px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            onClick={handleCreate}
            disabled={saving || !name.trim()}
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──

const SORT_LABELS: Record<SortMode, string> = {
  CREATED: '생성일순',
  NAME: '이름순',
  CUSTOM: '사용자 지정',
};

export default function Archive() {
  const navigate = useNavigate();

  const [folders, setFolders] = useState<ArchiveFolder[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>(
    () => (sessionStorage.getItem('archive-sort') as SortMode) || 'CREATED',
  );
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [editTarget, setEditTarget] = useState<ArchiveFolder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    getFolders()
      .then(async (res: FolderResponse[]) => {
        const mapped = res.map(mapFolderResponse);
        if (mapped.length === 0) {
          setFolders(FALLBACK_FOLDERS);
          return;
        }
        setFolders(mapped);

        // 각 폴더별 프리뷰 이미지 4장 로드
        const previews = await Promise.allSettled(
          mapped.map(async (folder) => {
            const fetcher =
              folder.folderType === 'ITEM' ? getArchiveItems : getArchiveVibes;
            const page = await fetcher(folder.numericId, undefined, 4);
            const urls = page.content
              .map((item) =>
                'imageUrl' in item ? item.imageUrl : item.generatedImageUrl,
              )
              .filter((url): url is string => !!url);
            return { folderId: folder.id, urls };
          }),
        );

        setFolders((prev) => {
          const imageMap = new Map<string, string[]>();
          for (const result of previews) {
            if (result.status === 'fulfilled') {
              imageMap.set(result.value.folderId, result.value.urls);
            }
          }
          return prev.map((f) => ({
            ...f,
            previewImages: imageMap.get(f.id) ?? f.previewImages,
          }));
        });
      })
      .catch(() => setFolders(FALLBACK_FOLDERS));
  }, []);

  const filteredFolders = filterType === 'ALL'
    ? folders
    : folders.filter((f) => f.folderType === filterType);
  const displayedFolders = sortFolders(filteredFolders, sortMode);

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    sessionStorage.setItem('archive-sort', mode);
    setShowSortDropdown(false);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setFolders((prev) => {
        const sorted = sortFolders(prev, 'CUSTOM');
        const oldIndex = sorted.findIndex((f) => f.id === active.id);
        const newIndex = sorted.findIndex((f) => f.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(sorted, oldIndex, newIndex);
        const updated = reordered.map((f, i) => ({ ...f, sortOrder: i }));

        // Persist changed sortOrders to backend
        updated.forEach((f) => {
          const original = prev.find((o) => o.id === f.id);
          if (original && original.sortOrder !== f.sortOrder) {
            updateFolder(f.numericId, { sortOrder: f.sortOrder }).catch(() => {});
          }
        });

        return updated;
      });
    },
    [],
  );

  const handleCreateFolder = (name: string, type: 'VIBE' | 'ITEM', isPublic: boolean) => {
    if (folders.length >= 5) {
      setShowCreateModal(false);
      setErrorMessage('폴더는 최대 5개까지 생성할 수 있습니다.');
      return;
    }
    createFolder({ folderName: name, folderType: type, isPublic })
      .then((res: FolderResponse) => {
        setFolders((prev) => [...prev, mapFolderResponse(res)]);
        setShowCreateModal(false);
      })
      .catch((err: unknown) => {
        setShowCreateModal(false);
        const msg =
          err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ARCHIVE_007'
            ? '폴더는 최대 5개까지 생성할 수 있습니다.'
            : '폴더 생성에 실패했습니다.';
        setErrorMessage(msg);
      });
  };

  const handleEditClick = (folder: ArchiveFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTarget(folder);
  };

  const handleRename = (newName: string, isPublic: boolean) => {
    if (!editTarget) return;
    const folderId = editTarget.numericId;
    updateFolder(folderId, { folderName: newName, isPublic })
      .then(() => {
        setFolders((prev) =>
          prev.map((f) => (f.numericId === folderId ? { ...f, title: newName, isPrivate: !isPublic } : f)),
        );
        setEditTarget(null);
      })
      .catch(() => alert('폴더 수정에 실패했습니다.'));
  };

  const handleDelete = () => {
    if (!editTarget) return;
    const folderId = editTarget.numericId;
    deleteFolder(folderId)
      .then(() => {
        setFolders((prev) => prev.filter((f) => f.numericId !== folderId));
        setEditTarget(null);
      })
      .catch(() => alert('폴더 삭제에 실패했습니다.'));
  };

  const createFolderCard = (
    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-card bg-surface">
      <button
        type="button"
        className="cursor-pointer rounded-control bg-white px-5 py-2.5 text-[16px] font-medium tracking-[-1px] text-default shadow-card transition-opacity duration-150 hover:opacity-80 font-pretendard"
        onClick={() => setShowCreateModal(true)}
      >
        만들기
      </button>
    </div>
  );

  return (
    <PageContainer className="mx-auto mt-6 max-w-190">
      {/* Category tabs */}
      <div className="flex gap-1 rounded-lg bg-surface p-1">
        {(Object.keys(FILTER_LABELS) as FilterType[]).map((type) => (
          <button
            key={type}
            type="button"
            className={`cursor-pointer rounded-md px-4 py-1.5 text-[14px] font-medium tracking-[-0.5px] transition-colors ${
              filterType === type
                ? 'bg-white text-high-emphasis shadow-sm'
                : 'text-caption hover:text-default'
            }`}
            onClick={() => setFilterType(type)}
          >
            {FILTER_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-stroke bg-white px-4 py-1.5 text-[14px] font-medium tracking-[-0.5px] text-high-emphasis transition-colors hover:bg-gray-50"
            onClick={() => setShowSortDropdown((v) => !v)}
          >
            <SortIcon />
            {SORT_LABELS[sortMode]}
            <ChevronDownIcon />
          </button>

          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute left-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-stroke bg-white shadow-lg">
                {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`w-full cursor-pointer px-4 py-2.5 text-left text-[13px] tracking-[-0.5px] transition-colors hover:bg-gray-50 ${
                      sortMode === mode ? 'font-semibold text-high-emphasis' : 'text-default'
                    }`}
                    onClick={() => handleSortChange(mode)}
                  >
                    {SORT_LABELS[mode]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card grid */}
      {sortMode === 'CUSTOM' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={displayedFolders.map((f) => f.id)} strategy={rectSortingStrategy}>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {displayedFolders.map((folder) => (
                <SortableFolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => navigate(`/archive/${folder.id}`, { state: { folderType: folder.folderType, folderName: folder.title } })}
                  onEdit={(e) => handleEditClick(folder, e)}
                />
              ))}
              {createFolderCard}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-4">
          {displayedFolders.map((folder) => (
            <PlainFolderCard
              key={folder.id}
              folder={folder}
              onClick={() => navigate(`/archive/${folder.id}`, { state: { folderType: folder.folderType, folderName: folder.title } })}
              onEdit={(e) => handleEditClick(folder, e)}
            />
          ))}
          {createFolderCard}
        </div>
      )}

      {/* Folder Edit Modal */}
      {editTarget && (
        <FolderEditModal
          folder={editTarget}
          onClose={() => setEditTarget(null)}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}

      {/* Folder Create Modal */}
      {showCreateModal && (
        <FolderCreateModal
          folderType={filterType === 'ITEM' ? 'ITEM' : 'VIBE'}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateFolder}
        />
      )}

      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setErrorMessage(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative z-10 w-80 rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-high-emphasis">알림</h3>
            <p className="mt-2 text-sm text-caption">{errorMessage}</p>
            <button
              type="button"
              className="mt-5 w-full cursor-pointer rounded-lg bg-high-emphasis px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              onClick={() => setErrorMessage(null)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
