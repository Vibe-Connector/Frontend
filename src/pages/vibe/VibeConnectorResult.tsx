import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault } from '@/components/common';

/* ---------- Mock Data ---------- */

const MOCK_RESULT = {
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
      key: 'fragrance',
      label: 'FRAGRANCE',
      items: [
        { id: 'f1', name: 'Santal 33', detail: 'Le Labo · 우디 머스크' },
        { id: 'f2', name: 'Replica Jazz Club', detail: 'Maison Margiela · 스모키' },
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

function SprayIcon() {
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
      <path d="M8 2h4v6H8z" />
      <path d="M10 8v2" />
      <path d="M6 12h8v10H6z" />
      <path d="M16 6h2" />
      <path d="M18 2h2" />
      <path d="M20 6h2" />
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
  fragrance: SprayIcon,
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

export default function VibeConnectorResult() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const result = MOCK_RESULT;

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
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-caption transition-colors hover:bg-stroke/50 hover:text-high-emphasis"
              aria-label="다시 생성"
            >
              <ShareIcon />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
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
