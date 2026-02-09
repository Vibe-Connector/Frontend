import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';

interface ArchiveFolder {
  id: string;
  title: string;
  pinCount: number;
  timeLabel: string;
  isPrivate?: boolean;
}

const dummyFolders: ArchiveFolder[] = [
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
        {dummyFolders.map((folder) => (
          <div
            key={folder.id}
            className="cursor-pointer"
            onClick={() => navigate(`/archive/${folder.id}`)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden rounded-card bg-surface">
              <ThumbnailGrid />

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
            onClick={() => alert('만들기 기능은 준비 중입니다.')}
          >
            만들기
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
