import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';

const LOADING_IMAGE = 'https://picsum.photos/seed/vibe-loading/800/400';

export default function VibeConnectorLoading() {
  const navigate = useNavigate();
  const [showFeed, setShowFeed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        navigate('/vibe/result/demo');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate]);

  return (
    <PageContainer>
      {/* Loading Card */}
      <div className="mx-auto max-w-[640px] overflow-hidden rounded-card bg-white shadow-card">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-surface">
          <img
            src={LOADING_IMAGE}
            alt="Vibe 생성 중"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="p-6 text-center">
          {/* Progress Spinner */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
            {progress < 100 ? (
              <svg className="h-12 w-12 animate-spin" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="var(--color-surface)" strokeWidth="3" />
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke="var(--color-primary)" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(progress, 100) * 1.256} 125.6`}
                  transform="rotate(-90 24 24)"
                  className="animate-smooth"
                />
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" fill="var(--color-primary)" opacity="0.15" />
                <path d="M16 24L22 30L32 18" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-high-emphasis">
            {progress < 100
              ? '요청하신 분위기가 곧 생성됩니다'
              : '분위기 생성 완료!'}
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-caption">
            {progress < 100
              ? '다른 유저들의 분위기가 궁금하진 않으신가요?'
              : '잠시 후 결과 페이지로 이동합니다'}
          </p>

          {/* Progress Bar */}
          <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-pill bg-surface">
            <div
              className="h-full rounded-pill bg-primary animate-smooth"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* CTA Button */}
          {!showFeed && progress < 100 && (
            <button
              type="button"
              onClick={() => setShowFeed(true)}
              className="mt-5 inline-flex items-center justify-center rounded-pill bg-brand px-8 py-3 text-sm font-medium text-white hover:opacity-80 active:opacity-70 cursor-pointer animate-smooth"
            >
              보러 가기
            </button>
          )}
        </div>
      </div>

      {/* Explore Feed Section */}
      {showFeed && (
        <div className="mt-10 animate-slide-right">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-high-emphasis">
              다른 유저들의 Vibe
            </h3>
            <button
              type="button"
              onClick={() => setShowFeed(false)}
              className="text-sm text-caption hover:text-high-emphasis animate-smooth cursor-pointer"
            >
              접기
            </button>
          </div>
          <ExploreMasonryGrid seedOffset={100} />
        </div>
      )}
    </PageContainer>
  );
}
