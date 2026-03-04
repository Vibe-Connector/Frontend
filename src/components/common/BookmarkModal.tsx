import { useState, useEffect } from 'react';
import { getFolders, archiveVibe, createFolder } from '@/api/archive';
import type { FolderResponse } from '@/api/archive';

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
  resultId: number;
  onArchived: (archiveId: number) => void;
}

export default function BookmarkModal({ open, onClose, resultId, onArchived }: BookmarkModalProps) {
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getFolders('VIBE')
      .then(async (list) => {
        if (list.length === 0) {
          const defaultFolder = await createFolder({
            folderName: '나의 Vibe',
            folderType: 'VIBE',
          });
          setFolders([defaultFolder]);
        } else {
          setFolders(list);
        }
      })
      .catch(() => setFolders([]))
      .finally(() => setLoading(false));
  }, [open]);

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
      const result = await archiveVibe({ resultId, folderId });
      onArchived(result.archiveId);
      onClose();
    } catch {
      // TODO: 에러 토스트
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
        folderType: 'VIBE',
      });
      setFolders((prev) => [...prev, folder]);
      setNewFolderName('');
      setCreatingFolder(false);
      // 생성된 폴더에 바로 아카이브
      const result = await archiveVibe({ resultId, folderId: folder.folderId });
      onArchived(result.archiveId);
      onClose();
    } catch {
      // TODO: 에러 토스트
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
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-card bg-white shadow-card">
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
        <div className="max-h-[300px] overflow-y-auto">
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

        {/* 새 폴더 만들기 */}
        <div className="border-t border-stroke px-5 py-3">
          {creatingFolder ? (
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
                }}
                className="shrink-0 rounded-lg border border-stroke px-3 py-2 text-sm text-caption transition-colors hover:bg-input"
              >
                취소
              </button>
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
