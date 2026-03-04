import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault } from '@/components/common';
import { getVibeSession, createVibe } from '@/api/vibe';
import type { VibeResultResponse } from '@/api/vibe';
import { useOptions } from '@/hooks/useOptions';

// [BEFORE INTEGRATION] const MOCK_RESULT = { ... 하드코딩 mock 데이터 }
// [AFTER INTEGRATION] 실제 API에서 데이터를 가져옴

/* ---------- Mock Data (API 실패 시 폴백) ---------- */

const FALLBACK_RESULT = {
  image: 'https://picsum.photos/seed/vibe-result/800/1100',
  sentence:
    'A warm afternoon wrapped in vintage textures and the quiet hum of a playlist — this is your vibe.',
  moodColor: '#C4A882',
  categories: [
    {
      key: 'light',
      label: 'LIGHT',
      items: [
        { id: 'l1', name: 'Warm White 2700K', detail: '밝기 60% · 따뜻한 톤' },
        { id: 'l2', name: 'Amber Glow', detail: '밝기 40% · 캔들 무드' },
      ],
    },
    {
      key: 'tvshow',
      label: 'TV SHOW',
      items: [
        { id: 't1', name: 'Midnight Diner', detail: '드라마 · 일본' },
        { id: 't2', name: 'Chef\'s Table', detail: '다큐멘터리 · Netflix' },
      ],
    },
    {
      key: 'coffee',
      label: 'COFFEE',
      items: [
        { id: 'f1', name: 'Ethiopia Yirgacheffe', detail: '플로럴 · 시트러스' },
        { id: 'f2', name: 'Colombia Supremo', detail: '견과류 · 초콜릿' },
      ],
    },
    {
      key: 'playlist',
      label: 'PLAYLIST',
      items: [
        { id: 'p1', name: 'Lo-fi Autumn Breeze', detail: '32곡 · 2시간 14분' },
        { id: 'p2', name: 'Vintage Café Jazz', detail: '28곡 · 1시간 52분' },
      ],
    },
  ],
};

/* ---------- Icons ---------- */

function ShareIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function LightBulbIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, () => React.JSX.Element> = {
  light: LightBulbIcon,
  tvshow: TvIcon,
  coffee: CoffeeIcon,
  playlist: MusicIcon,
};

/* ---------- Sub-Components ---------- */

function ItemRow({
  item,
  categoryKey,
}: {
  item: { id: string; name: string; detail: string };
  categoryKey: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 rounded-control bg-surface px-4 py-3 transition-colors duration-150 hover:bg-stroke/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-high-emphasis">
          {item.name}
        </p>
        <p className="truncate text-xs text-caption">{item.detail}</p>
      </div>
      {categoryKey === 'playlist' && hovered && (
        <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <PlayIcon />
        </button>
      )}
    </div>
  );
}

/* ---------- Main Component ---------- */

// API 결과를 UI 형식으로 변환
function mapApiResultToView(apiResult: VibeResultResponse) {
  const CATEGORY_LABELS: Record<string, string> = {
    movie: 'TV SHOW', music: 'PLAYLIST', lighting: 'LIGHT', coffee: 'COFFEE',
    light: 'LIGHT', tvshow: 'TV SHOW', playlist: 'PLAYLIST',
  };
  return {
    image: 'https://picsum.photos/seed/vibe-result/800/1100', // AI 이미지 URL은 추후 백엔드에서 제공
    sentence: apiResult.phrase ?? 'Your unique vibe.',
    moodColor: '#C4A882',
    categories: apiResult.recommendations.map((cat) => ({
      key: cat.categoryKey === 'movie'    ? 'tvshow'    :
           cat.categoryKey === 'music'    ? 'playlist'  :
           cat.categoryKey === 'lighting' ? 'light'     :
           cat.categoryKey,
      label: CATEGORY_LABELS[cat.categoryKey] ?? cat.categoryKey.toUpperCase(),
      items: cat.items.map((item) => ({
        id: String(item.itemId),
        name: item.itemName ?? item.itemKey,
        detail: [item.brand, item.recommendReason].filter(Boolean).join(' · ') || cat.categoryKey,
      })),
    })),
  };
}

export default function VibeConnectorResult() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { data: options } = useOptions();

  // [AFTER INTEGRATION] API에서 결과 데이터 로드
  const [result, setResult] = useState(FALLBACK_RESULT);
  const [apiResult, setApiResult] = useState<VibeResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!sessionId || sessionId === 'demo') return;
    setLoading(true);
    getVibeSession(Number(sessionId))
      .then((data) => {
        setApiResult(data);
        setResult(mapApiResultToView(data));
      })
      .catch(() => setResult(FALLBACK_RESULT))
      .finally(() => setLoading(false));
  }, [sessionId]);

  /** 같은 입력값으로 Vibe 재생성 */
  const handleRegenerate = async () => {
    if (!apiResult?.selectedOptions || !options || regenerating) return;
    const sel = apiResult.selectedOptions;

    const moodKeywordIds = sel.moods
      .map((label) => options.moods.find((m) => m.label === label || m.keywordValue === label))
      .filter(Boolean)
      .map((m) => m!.keywordId);

    const timeOption = options.times.find((t) => t.timeValue === sel.time || t.timeKey === sel.time);
    const weatherOption = options.weathers.find((w) => w.label === sel.weather || w.weatherKey === sel.weather);
    const placeOption = options.places.find((p) => p.label === sel.place || p.placeKey === sel.place);
    const companionOption = options.companions.find((c) => c.label === sel.companion || c.companionKey === sel.companion);

    if (!timeOption || !weatherOption || !placeOption || !companionOption || moodKeywordIds.length === 0) {
      alert('옵션 매핑에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    setRegenerating(true);
    try {
      const newResult = await createVibe({
        moodKeywordIds,
        timeId: timeOption.timeId,
        weatherId: weatherOption.weatherId,
        placeId: placeOption.placeId,
        companionId: companionOption.companionId,
      });
      navigate(`/vibe/result/${newResult.sessionId}`, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '재생성에 실패했습니다.';
      alert(message);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <p className="text-caption">결과를 불러오는 중...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="!px-0">
      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - var(--spacing-header) - var(--spacing-footer) - 64px)' }}>
        {/* ===== Main Area ===== */}
        <div className="flex flex-1 flex-col gap-6 px-[var(--spacing-page-x)] lg:flex-row">
          {/* Left — AI Generated Image */}
          <div className="flex flex-1 items-start justify-center lg:justify-start">
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-card">
              <img
                src={result.image}
                alt={`Vibe 결과 이미지 (세션: ${sessionId})`}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Right — ITEMS USED Panel */}
          <div className="w-full flex-shrink-0 lg:w-[380px]">
            <div className="rounded-card border border-stroke bg-white p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-wide text-high-emphasis">
                  ITEMS USED
                </h2>
                <div
                  className="h-10 w-10 rounded-full border-2 border-stroke"
                  style={{ backgroundColor: result.moodColor }}
                  title="무드 컬러"
                />
              </div>

              {/* Category Sections */}
              <div className="space-y-5">
                {result.categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.key];
                  return (
                    <div key={cat.key}>
                      <div className="mb-2 flex items-center gap-2">
                        {Icon && (
                          <span className="text-caption">
                            <Icon />
                          </span>
                        )}
                        <h3 className="text-xs font-bold tracking-widest text-high-emphasis">
                          {cat.label}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {cat.items.map((item) => (
                          <ItemRow
                            key={item.id}
                            item={item}
                            categoryKey={cat.key}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="mt-6 flex flex-col items-stretch gap-4 px-[var(--spacing-page-x)] sm:flex-row sm:items-center">
          {/* Sentence Card */}
          <div className="flex flex-1 items-center gap-4 rounded-control bg-surface px-5 py-4">
            <div className="h-8 w-1 flex-shrink-0 rounded-full bg-brand" />
            <p className="flex-1 text-sm font-medium tracking-tight text-high-emphasis">
              {result.sentence}
            </p>
            <button
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-caption transition-colors hover:bg-stroke/50 hover:text-high-emphasis disabled:opacity-40"
              aria-label="다시 생성"
              onClick={handleRegenerate}
              disabled={regenerating || !apiResult}
            >
              {regenerating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-caption border-t-brand" />
              ) : (
                <ShareIcon />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <ButtonDefault
              shape="rect"
              className="min-w-[120px]"
              onClick={() => navigate(`/feed/create?sessionId=${sessionId}`)}
            >
              SHARE
            </ButtonDefault>
            <ButtonDefault
              shape="rect"
              className="min-w-[120px]"
              onClick={() => navigate('/vibe/edit')}
            >
              EDIT
            </ButtonDefault>
            <ButtonDefault
              shape="rect"
              className="min-w-[120px]"
              onClick={() => navigate('/vibe/connect')}
            >
              CONNECT
            </ButtonDefault>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
