import { useState, useEffect } from 'react';
import { getFolders, archiveVibe, archiveItem, createFolder } from '@/api/archive';
import type { FolderResponse } from '@/api/archive';
import { ApiError } from '@/api/types';

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
  resultId?: number;
  itemId?: number;
  onArchived: (archiveId: number) => void;
}

export default function BookmarkModal({ open, onClose, resultId, itemId, onArchived }: BookmarkModalProps) {
  const folderType = itemId ? 'ITEM' : 'VIBE';
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPublic, setNewFolderPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    getFolders(folderType)
      .then(async (list) => {
        // 백엔드 필터링 보완: 클라이언트에서도 folderType 일치하는 것만 필터
        const filtered = list.filter((f) => f.folderType === folderType);
        if (filtered.length === 0) {
          try {
            const defaultFolder = await createFolder({
              folderName: folderType === 'ITEM' ? '나의 아이템' : '나의 Vibe',
              folderType,
            });
            setFolders([defaultFolder]);
          } catch {
            setFolders([]);
            setError('새 폴더를 만들고 저장해주세요.');
          }
        } else {
          setFolders(filtered);
        }
      })
      .catch(() => setFolders([]))
      .finally(() => setLoading(false));
  }, [open, folderType]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSelectFolder = async (folderId: number) => {
    if (saving) return;
    setSaving(true);
    try {
      if (itemId) {
        const result = await archiveItem({ itemId, folderId });
        onArchived(result.archiveItemId);
      } else if (resultId) {
        const result = await archiveVibe({ resultId, folderId });
        onArchived(result.archiveId);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 'ARCHIVE_008') {
        setError('폴더당 최대 20개까지 저장할 수 있습니다.');
      } else {
        setError(err instanceof ApiError ? err.message : '저장에 실패했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || saving) return;
    setSaving(true);
    try {
      const folder = await createFolder({
        folderName: newFolderName.trim(),
        folderType,
        isPublic: newFolderPublic,
      });
      setFolders((prev) => [...prev, folder]);
      setNewFolderName('');
      setCreatingFolder(false);
      // 생성된 폴더에 바로 아카이브
      if (itemId) {
        const result = await archiveItem({ itemId, folderId: folder.folderId });
        onArchived(result.archiveItemId);
      } else if (resultId) {
        const result = await archiveVibe({ resultId, folderId: folder.folderId });
        onArchived(result.archiveId);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 'ARCHIVE_007') {
        setError('폴더는 최대 5개까지 생성할 수 있습니다.');
        setCreatingFolder(false);
        setNewFolderName('');
      } else {
        setError(err instanceof ApiError ? err.message : '폴더 생성에 실패했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-pretendard"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-card bg-white shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-5 py-4">
          <h2 className="text-base font-bold text-high-emphasis">폴더에 저장</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-low-emphasis transition-colors hover:bg-input hover:text-high-emphasis"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708Z" />
            </svg>
          </button>
        </div>

        {/* Folder list */}
        <div className="max-h-75 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-stroke border-t-accent" />
            </div>
          ) : (
            <>
              {folders.map((folder) => (
                <button
                  key={folder.folderId}
                  type="button"
                  disabled={saving}
                  onClick={() => handleSelectFolder(folder.folderId)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-input disabled:opacity-50"
                >
                  <span className="text-lg">📂</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-high-emphasis">
                      {folder.folderName}
                    </p>
                    <p className="text-xs text-low-emphasis">{folder.archiveCount}개 항목</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mx-5 mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* 새 폴더 만들기 */}
        <div className="border-t border-stroke px-5 py-3">
          {creatingFolder ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="폴더 이름"
                  autoFocus
                  className="min-w-0 flex-1 rounded-lg border border-stroke px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <button
                  type="button"
                  disabled={!newFolderName.trim() || saving}
                  onClick={handleCreateFolder}
                  className="shrink-0 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingFolder(false);
                    setNewFolderName('');
                    setNewFolderPublic(true);
                  }}
                  className="shrink-0 rounded-lg border border-stroke px-3 py-2 text-sm text-caption transition-colors hover:bg-input"
                >
                  취소
                </button>
              </div>
              <label className="flex items-center justify-between text-xs text-default">
                <span>{newFolderPublic ? '공개' : '비공개'}</span>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    newFolderPublic ? 'bg-high-emphasis' : 'bg-gray-200'
                  }`}
                  onClick={() => setNewFolderPublic((v) => !v)}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      newFolderPublic ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreatingFolder(true)}
              className="flex w-full items-center gap-2 rounded-lg py-2 text-sm font-medium text-accent transition-colors hover:bg-input"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
              </svg>
              새 폴더 만들기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
