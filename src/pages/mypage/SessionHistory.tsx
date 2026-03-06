import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { getVibeHistory } from '@/api/vibe';
import type { VibeHistoryResponse } from '@/api/vibe';

export default function SessionHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<VibeHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVibeHistory()
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <div className="mx-auto max-w-[760px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-full p-1 transition-colors hover:bg-surface"
            onClick={() => navigate('/profile/report')}
            aria-label="뒤로 가기"
          >
            <svg
              className="h-5 w-5 text-high-emphasis"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold tracking-[-1px] text-high-emphasis">
            Vibe 히스토리
          </h1>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-disabled border-t-accent" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="mt-12 text-center text-sm text-caption">
            아직 생성한 Vibe가 없습니다.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {sessions.map((s) => (
              <li key={s.sessionId}>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-4 rounded-card border border-stroke bg-white p-4 text-left transition-shadow hover:shadow-card"
                  onClick={() => navigate(`/vibe/result/${s.sessionId}`)}
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-control bg-disabled">
                    {s.generatedImageUrl && (
                      <img
                        src={s.generatedImageUrl}
                        alt={s.phrase ?? ''}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-high-emphasis">
                      {s.phrase || '분위기 문구 없음'}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.moods.slice(0, 3).map((mood) => (
                        <span
                          key={mood}
                          className="rounded-full bg-surface px-2 py-0.5 text-xs text-caption"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-caption">
                      {new Date(s.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-5 w-5 shrink-0 text-caption"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
