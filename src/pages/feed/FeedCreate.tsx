import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { getVibeSession } from '@/api/vibe';
import { createFeed } from '@/api/feed';
import type { VibeResultResponse } from '@/api/vibe';

export default function FeedCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = Number(searchParams.get('sessionId'));

  const [vibeResult, setVibeResult] = useState<VibeResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Vibe 결과 로드 ──
  useEffect(() => {
    if (!sessionId || isNaN(sessionId)) {
      setError('유효하지 않은 세션입니다');
      setLoading(false);
      return;
    }

    getVibeSession(sessionId)
      .then((res) => {
        setVibeResult(res);
        if (res.phrase) setCaption(res.phrase);
      })
      .catch(() => setError('Vibe 결과를 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  // ── 피드 게시 ──
  const handlePublish = () => {
    if (!vibeResult || submitting) return;
    setSubmitting(true);
    setError(null);

    createFeed({
      resultId: vibeResult.resultId,
      caption: caption.trim() || null,
      isPublic,
    })
      .then((res) => navigate(`/feed/${res.feedId}`, { replace: true }))
      .catch((err) => {
        const msg = err?.response?.data?.message;
        if (msg?.includes('이미') || err?.response?.status === 409) {
          setError('이미 게시된 Vibe입니다');
        } else {
          setError('피드 게시에 실패했습니다. 다시 시도해주세요');
        }
      })
      .finally(() => setSubmitting(false));
  };

  // ── 로딩 ──
  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  // ── 에러 (Vibe 결과 없음) ──
  if (error && !vibeResult) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-caption">
          <p className="text-lg font-medium">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-accent hover:underline"
          >
            돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-lg">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-caption hover:text-high-emphasis"
          >
            취소
          </button>
          <h1 className="text-lg font-semibold text-high-emphasis">새 피드</h1>
          <button
            type="button"
            onClick={handlePublish}
            disabled={submitting || !vibeResult}
            className="text-sm font-semibold text-accent disabled:opacity-50"
          >
            {submitting ? '게시 중...' : '게시'}
          </button>
        </div>

        {/* 이미지 미리보기 */}
        {vibeResult?.generatedImageUrl && (
          <div className="overflow-hidden rounded-card bg-surface">
            <img
              src={vibeResult.generatedImageUrl}
              alt={vibeResult.phrase ?? 'Vibe'}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Phrase */}
        {vibeResult?.phrase && (
          <p className="mt-4 text-center text-sm font-medium text-caption">
            {vibeResult.phrase}
          </p>
        )}

        {/* 캡션 입력 */}
        <div className="mt-6">
          <label htmlFor="caption" className="mb-2 block text-sm font-medium text-high-emphasis">
            캡션
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="이 Vibe에 대해 한마디..."
            maxLength={2000}
            rows={3}
            className="w-full resize-none rounded-card border border-stroke bg-surface px-4 py-3 text-sm text-high-emphasis placeholder:text-caption focus:border-accent focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-caption">{caption.length}/2000</p>
        </div>

        {/* 공개/비공개 토글 */}
        <div className="mt-4 flex items-center justify-between rounded-card bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-medium text-high-emphasis">공개 설정</p>
            <p className="text-xs text-caption">
              {isPublic ? '모든 사용자가 이 피드를 볼 수 있습니다' : '나만 볼 수 있습니다'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic((prev) => !prev)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isPublic ? 'bg-accent' : 'bg-disabled'}`}
            aria-label={isPublic ? '비공개로 전환' : '공개로 전환'}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isPublic ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        {/* 게시 버튼 (모바일용) */}
        <button
          type="button"
          onClick={handlePublish}
          disabled={submitting || !vibeResult}
          className="mt-6 w-full rounded-card bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {submitting ? '게시 중...' : isPublic ? '피드에 공개하기' : '비공개로 저장하기'}
        </button>
      </div>
    </PageContainer>
  );
}
