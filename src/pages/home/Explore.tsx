import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';
import { getExploreVibes } from '@/api/explore';
import type { ExploreVibeResponse } from '@/api/explore';

export default function Explore() {
  // [BEFORE INTEGRATION] <ExploreMasonryGrid /> (Picsum 이미지만 표시)
  // [AFTER INTEGRATION] 실제 인기 Vibe 데이터 로드 시도, 실패 시 폴백
  const [vibes, setVibes] = useState<ExploreVibeResponse[]>([]);
  const [useApi, setUseApi] = useState(true);

  useEffect(() => {
    getExploreVibes('WEEK')
      .then((res) => setVibes(res.content))
      .catch(() => setUseApi(false));
  }, []);

  return (
    <PageContainer>
      {useApi && vibes.length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
          {vibes.map((vibe) => (
            <div key={vibe.feedId} className="mb-4 break-inside-avoid">
              <div className="overflow-hidden rounded-card bg-surface">
                {vibe.generatedImageUrl ? (
                  <img
                    src={vibe.generatedImageUrl}
                    alt={vibe.caption ?? 'Vibe'}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-disabled text-caption">
                    No Image
                  </div>
                )}
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-high-emphasis">
                    {vibe.authorNickname}
                  </p>
                  {vibe.caption && (
                    <p className="mt-1 truncate text-xs text-caption">{vibe.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ExploreMasonryGrid />
      )}
    </PageContainer>
  );
}
