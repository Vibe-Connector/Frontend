import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';

/* ---------- Mock Data ---------- */

interface ServiceConnection {
  id: string;
  name: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  tags: string[];
  status: 'connected' | 'available';
  info: string;
}

const SERVICES: ServiceConnection[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    color: '#1DB954',
    title: 'Playlist 자동 생성',
    description: 'Vibe에 맞는 음악 플레이리스트를 Spotify에 자동으로 생성합니다.',
    tags: ['Music', 'Auto-sync'],
    status: 'connected',
    info: '연동됨',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    icon: '🎬',
    color: '#E50914',
    title: '콘텐츠 추천 연동',
    description: '추천된 영화와 드라마를 Netflix 시청 목록에 추가합니다.',
    tags: ['Streaming', 'Watchlist'],
    status: 'available',
    info: 'Free',
  },
  {
    id: 'hue',
    name: 'Philips Hue',
    icon: '💡',
    color: '#0065D3',
    title: '스마트 조명 제어',
    description: 'Vibe에 맞는 색온도와 밝기를 Hue 조명에 즉시 적용합니다.',
    tags: ['IoT', 'Real-time'],
    status: 'connected',
    info: '연동됨',
  },
  {
    id: 'nespresso',
    name: 'Nespresso',
    icon: '☕',
    color: '#6B4226',
    title: '캡슐 커피 추천',
    description: '분위기에 어울리는 네스프레소 캡슐을 추천하고 주문 페이지로 연결합니다.',
    tags: ['Commerce', 'Affiliate'],
    status: 'available',
    info: 'Free',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    title: 'Vibe 이미지 공유',
    description: 'AI 생성 이미지와 Vibe 요약을 Instagram에 바로 공유합니다.',
    tags: ['Social', 'Share'],
    status: 'available',
    info: 'Free',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    icon: '🎧',
    color: '#FC3C44',
    title: 'Playlist 연동',
    description: 'Vibe 플레이리스트를 Apple Music 라이브러리에 추가합니다.',
    tags: ['Music', 'Auto-sync'],
    status: 'connected',
    info: '연동됨',
  },
];

/* ---------- Icons ---------- */

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ---------- Sub-Components ---------- */

function ServiceCard({ service }: { service: ServiceConnection }) {
  const [saved, setSaved] = useState(service.status === 'connected');

  return (
    <div className="flex flex-col rounded-card bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* Top row: icon + save */}
      <div className="mb-3 flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: service.color + '18' }}
        >
          {service.icon}
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium transition-colors ${
            saved
              ? 'bg-brand/10 text-brand'
              : 'bg-surface text-caption hover:text-high-emphasis'
          }`}
        >
          {saved ? 'Saved' : 'Save'}
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Service name + time */}
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-high-emphasis">
          {service.name}
        </span>
        <span className="text-xs text-low-emphasis">
          {service.status === 'connected' ? '연결됨' : '미연결'}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-bold text-high-emphasis">
        {service.title}
      </h3>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-pill border border-stroke px-2.5 py-0.5 text-xs text-caption"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-xs leading-relaxed text-caption">
        {service.description}
      </p>

      {/* Bottom row: info + action */}
      <div className="flex items-center justify-between border-t border-stroke pt-3">
        <div>
          <p className="text-sm font-bold text-high-emphasis">{service.info}</p>
        </div>
        <button
          className={`rounded-control px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80 ${
            service.status === 'connected'
              ? 'bg-brand text-white'
              : 'bg-high-emphasis text-white'
          }`}
        >
          {service.status === 'connected' ? 'Connected' : 'Connect'}
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function VibeConnectorConnect() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => navigate(-1)} />

      {/* Modal panel */}
      <div className="fixed inset-4 z-50 flex items-center justify-center sm:inset-8 lg:inset-16">
        <div
          className="relative max-h-full w-full max-w-[1100px] overflow-y-auto rounded-card bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.2)] sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-caption transition-colors hover:bg-surface hover:text-high-emphasis"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-high-emphasis">
              외부 서비스 연동
            </h1>
            <p className="mt-1 text-sm text-caption">
              Vibe 추천 결과를 외부 서비스에 바로 연결하세요
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
