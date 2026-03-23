import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVibeHistory } from '@/api/vibe';
import type { VibeHistoryResponse } from '@/api/vibe';

const MAX_DISPLAY = 5;

export default function RecentSessions() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<VibeHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVibeHistory()
      .then((data) => setSessions(data.slice(0, MAX_DISPLAY)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-card border border-stroke bg-white p-6">
        <h2 className="text-lg font-semibold tracking-[-0.5px] text-high-emphasis">
          {t('recentSessions.title')}
        </h2>
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-disabled border-t-accent" />
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-card border border-stroke bg-white p-6">
        <h2 className="text-lg font-semibold tracking-[-0.5px] text-high-emphasis">
          {t('recentSessions.title')}
        </h2>
        <p className="mt-6 text-center text-sm text-caption">
          {t('recentSessions.empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-stroke bg-white p-6">
      <h2 className="text-lg font-semibold tracking-[-0.5px] text-high-emphasis">
        최근 생성한 Vibe
      </h2>

      <ul className="mt-4 divide-y divide-stroke">
        {sessions.map((s) => (
          <li key={s.sessionId}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-4 py-3 text-left transition-colors hover:bg-surface/50"
              onClick={() => navigate(`/vibe/result/${s.sessionId}`)}
            >
              {/* Thumbnail */}
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-control bg-disabled">
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
                  {s.phrase || t('recentSessions.noDescription')}
                </p>
                <p className="mt-0.5 text-xs text-caption">
                  {new Date(s.createdAt).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="h-4 w-4 shrink-0 text-caption"
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

      {/* View All */}
      <button
        type="button"
        className="mt-4 w-full cursor-pointer rounded-control border border-stroke py-2.5 text-center text-sm font-medium text-caption transition-colors hover:bg-surface"
        onClick={() => navigate('/profile/sessionhistory')}
      >
        {t('recentSessions.viewAll')}
      </button>
    </div>
  );
}
