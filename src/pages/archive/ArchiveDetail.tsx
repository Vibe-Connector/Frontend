import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';
import { getArchiveVibes } from '@/api/archive';
import type { ArchiveVibeResponse } from '@/api/archive';

export default function ArchiveDetail() {
  const { folderId } = useParams<{ folderId: string }>();

  // [BEFORE INTEGRATION] <ExploreMasonryGrid seedOffset={...} /> 만 표시
  // [AFTER INTEGRATION] 실제 아카이브 Vibe 데이터 로드, 실패 시 폴백
  const [vibes, setVibes] = useState<ArchiveVibeResponse[]>([]);
  const [useApi, setUseApi] = useState(true);
  const [folderName, setFolderName] = useState(folderId ?? '');

  useEffect(() => {
    const numId = Number(folderId);
    if (isNaN(numId)) {
      setUseApi(false);
      return;
    }

    getArchiveVibes(numId)
      .then((res) => {
        setVibes(res.content);
        if (res.content.length > 0 && res.content[0].folderName) {
          setFolderName(res.content[0].folderName);
        }
      })
      .catch(() => setUseApi(false));
  }, [folderId]);

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold tracking-[-1px] text-high-emphasis">
        Archive — {folderName}
      </h1>

      {useApi && vibes.length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
          {vibes.map((vibe) => (
            <div key={vibe.archiveId} className="mb-4 break-inside-avoid">
              <div className="overflow-hidden rounded-card bg-surface">
                {vibe.generatedImageUrl ? (
                  <img
                    src={vibe.generatedImageUrl}
                    alt={vibe.phrase ?? 'Archived Vibe'}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-disabled text-caption">
                    No Image
                  </div>
                )}
                <div className="p-2">
                  {vibe.phrase && (
                    <p className="truncate text-xs font-medium text-high-emphasis">
                      {vibe.phrase}
                    </p>
                  )}
                  {vibe.memo && (
                    <p className="mt-1 truncate text-xs text-caption">{vibe.memo}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ExploreMasonryGrid seedOffset={Number(folderId) * 100 || 1} />
      )}
    </PageContainer>
  );
}
