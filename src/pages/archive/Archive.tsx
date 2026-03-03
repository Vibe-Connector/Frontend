import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { getFolders, createFolder } from '@/api/archive';
import type { FolderResponse } from '@/api/archive';

interface ArchiveFolder {
  id: string;
  title: string;
  pinCount: number;
  timeLabel: string;
  isPrivate?: boolean;
  thumbnailUrl?: string | null;
}

// [BEFORE INTEGRATION] 하드코딩된 dummyFolders
// const dummyFolders: ArchiveFolder[] = [
//   { id: '1', title: 'MyItems', pinCount: 0, timeLabel: '방금' },
//   { id: '2', title: 'MyPlaces', pinCount: 0, timeLabel: '방금', isPrivate: true },
// ];

// [AFTER INTEGRATION] API 실패 시 폴백
const FALLBACK_FOLDERS: ArchiveFolder[] = [
  { id: '1', title: 'MyItems', pinCount: 0, timeLabel: '방금' },
  { id: '2', title: 'MyPlaces', pinCount: 0, timeLabel: '방금', isPrivate: true },
];

function LockIcon() {
  return (
    <svg
      className="h-5 w-5 text-high-emphasis"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      className="h-5 w-5 text-high-emphasis"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17 2.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5ZM17 15.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5ZM3.75 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM4.5 2.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5ZM10 11a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 10 11ZM10.75 2.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5ZM10 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.75 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM16.25 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  );
}

/* 2×2 thumbnail placeholder grid */
function ThumbnailGrid() {
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
      <div className="bg-disabled" />
      <div className="bg-disabled" />
      <div className="bg-disabled" />
      <div className="bg-disabled" />
    </div>
  );
}

export default function Archive() {
  const navigate = useNavigate();

  // [AFTER INTEGRATION] API에서 폴더 목록 로드
  const [folders, setFolders] = useState<ArchiveFolder[]>([]);

  useEffect(() => {
    getFolders()
      .then((res: FolderResponse[]) => {
        const mapped: ArchiveFolder[] = res.map((f) => ({
          id: String(f.folderId),
          title: f.folderName,
          pinCount: f.archiveCount,
          timeLabel: new Date(f.createdAt).toLocaleDateString('ko-KR'),
          isPrivate: false,
          thumbnailUrl: f.thumbnailUrl,
        }));
        setFolders(mapped.length > 0 ? mapped : FALLBACK_FOLDERS);
      })
      .catch(() => setFolders(FALLBACK_FOLDERS));
  }, []);

  const handleCreateFolder = () => {
    const name = prompt('새 폴더 이름을 입력하세요:');
    if (!name) return;
    createFolder({ folderName: name, folderType: 'VIBE' })
      .then((res: FolderResponse) => {
        setFolders((prev) => [
          ...prev,
          {
            id: String(res.folderId),
            title: res.folderName,
            pinCount: 0,
            timeLabel: '방금',
            thumbnailUrl: res.thumbnailUrl,
          },
        ]);
      })
      .catch(() => alert('폴더 생성에 실패했습니다.'));
  };

  return (
    <PageContainer className="mx-auto mt-6 max-w-[760px]">
      {/* Top bar: filter icon + group tag */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-pointer p-1 transition-opacity duration-150 hover:opacity-70"
          aria-label="필터"
        >
          <FilterIcon />
        </button>

        <span className="rounded-full border border-stroke bg-white px-4 py-1.5 text-[14px] font-medium tracking-[-0.5px] text-high-emphasis">
          그룹
        </span>
      </div>

      {/* Card grid */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Folder cards */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="cursor-pointer"
            onClick={() => navigate(`/archive/${folder.id}`)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden rounded-card bg-surface">
              {folder.thumbnailUrl ? (
                <img
                  src={folder.thumbnailUrl}
                  alt={folder.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ThumbnailGrid />
              )}

              {folder.isPrivate && (
                <div className="absolute top-3 left-3">
                  <LockIcon />
                </div>
              )}
            </div>

            {/* Info */}
            <p className="mt-2 text-[16px] font-semibold tracking-[-1px] text-high-emphasis">
              {folder.title}
            </p>
            <p className="text-[13px] tracking-[-0.5px] text-caption">
              핀 {folder.pinCount}개&nbsp;&nbsp;{folder.timeLabel}
            </p>
          </div>
        ))}

        {/* Create new folder card */}
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-card bg-surface">
          <button
            type="button"
            className="cursor-pointer rounded-control bg-white px-5 py-2.5 text-[16px] font-medium tracking-[-1px] text-default shadow-card transition-opacity duration-150 hover:opacity-80 font-pretendard"
            onClick={handleCreateFolder}
          >
            만들기
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
