import { useState, useEffect, useRef, useCallback } from 'react';
import { getItemDetail, type ItemCategory, type ItemDetailResponse } from '@/api/item';
import { searchSpotifyTrack } from '@/api/spotify';
import type { SpotifyTrackResponse } from '@/api/spotify';
import type {
  MovieDetailResponse,
  MusicDetailResponse,
  LightingDetailResponse,
  CoffeeDetailResponse,
} from '@/api/types';
import ImageWithFallback from './ImageWithFallback';

/* ── Props ── */

export interface ItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
  categoryKey: string;
  onArchive?: () => void;
}

/* ── 카테고리 매핑 ── */

const CATEGORY_MAP: Record<string, ItemCategory> = {
  movie: 'movie',
  video: 'movie',
  music: 'music',
  lighting: 'lighting',
  coffee: 'coffee',
};

function toItemCategory(key: string): ItemCategory | null {
  return CATEGORY_MAP[key.toLowerCase()] ?? null;
}

/* ── 도메인별 라벨 ── */

const CATEGORY_LABELS: Record<string, string> = {
  movie: '영화',
  music: '음악',
  lighting: '조명',
  coffee: '커피',
};

/* ── 타입 가드 ── */

function isMovie(d: ItemDetailResponse, cat: ItemCategory): d is MovieDetailResponse {
  return cat === 'movie';
}
function isMusic(d: ItemDetailResponse, cat: ItemCategory): d is MusicDetailResponse {
  return cat === 'music';
}
function isLighting(d: ItemDetailResponse, cat: ItemCategory): d is LightingDetailResponse {
  return cat === 'lighting';
}
function isCoffee(d: ItemDetailResponse, cat: ItemCategory): d is CoffeeDetailResponse {
  return cat === 'coffee';
}

/* ── 유틸 ── */

function formatMs(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex justify-between gap-2 py-1">
      <span className="shrink-0 text-caption">{label}</span>
      <span className="text-right font-medium text-high-emphasis">{value}</span>
    </div>
  );
}

/* ── 아이콘 ── */

function SpotifyIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

/* ── 도메인별 상세 섹션 ── */

function MovieDetail({ data }: { data: MovieDetailResponse }) {
  return (
    <div className="space-y-2 text-sm">
      {data.originalTitle && <InfoRow label="원제" value={data.originalTitle} />}
      {data.contentType && <InfoRow label="유형" value={data.contentType === 'TV' ? 'TV 시리즈' : '영화'} />}
      <InfoRow label="개봉일" value={data.releaseDate} />
      <InfoRow label="러닝타임" value={data.runtime ? `${data.runtime}분` : null} />
      <InfoRow label="평점" value={data.voteAverage ? `${data.voteAverage.toFixed(1)} (${data.voteCount?.toLocaleString()}명)` : null} />
      {data.genres.length > 0 && <InfoRow label="장르" value={data.genres.join(', ')} />}
      {data.castInfo.length > 0 && (
        <div className="pt-1">
          <p className="mb-1 text-caption">출연진</p>
          <div className="flex flex-wrap gap-1">
            {data.castInfo.slice(0, 6).map((c) => (
              <span key={c.name} className="rounded-full bg-surface px-2 py-0.5 text-xs text-high-emphasis">
                {c.name}{c.role ? ` (${c.role})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.overview && (
        <div className="pt-1">
          <p className="mb-1 text-caption">줄거리</p>
          <p className="line-clamp-4 text-xs leading-relaxed text-high-emphasis">{data.overview}</p>
        </div>
      )}
    </div>
  );
}

function MusicDetailSection({ data, spotifyData }: { data: MusicDetailResponse; spotifyData: SpotifyTrackResponse | null }) {
  return (
    <div className="space-y-2 text-sm">
      {data.artists.length > 0 && <InfoRow label="아티스트" value={data.artists.map((a) => a.name).join(', ')} />}
      <InfoRow label="앨범" value={data.albumName} />
      {data.genres.length > 0 && <InfoRow label="장르" value={data.genres.join(', ')} />}
      <InfoRow label="발매일" value={data.releaseDate} />
      <InfoRow label="재생 시간" value={data.trackDurationMs ? formatMs(data.trackDurationMs) : null} />
      <InfoRow label="유형" value={data.contentType} />
      {/* Spotify에서 가져온 추가 정보 */}
      {spotifyData && !data.artists.length && spotifyData.artists.length > 0 && (
        <InfoRow label="아티스트" value={spotifyData.artists.join(', ')} />
      )}
      {spotifyData?.albumName && !data.albumName && (
        <InfoRow label="앨범" value={spotifyData.albumName} />
      )}
    </div>
  );
}

function LightingDetail({ data }: { data: LightingDetailResponse }) {
  return (
    <div className="space-y-2 text-sm">
      <InfoRow label="조명 유형" value={data.lightingType} />
      <InfoRow label="색상" value={data.lightColor} />
      <InfoRow label="색온도" value={data.colorTempKelvin ? `${data.colorTempKelvin}K${data.colorTempName ? ` (${data.colorTempName})` : ''}` : data.colorTempName} />
      <InfoRow label="밝기" value={data.brightnessPercent ? `${data.brightnessPercent}%${data.brightnessLevel ? ` (${data.brightnessLevel})` : ''}` : data.brightnessLevel} />
      <InfoRow label="위치" value={data.position} />
      <InfoRow label="공간" value={data.spaceContext} />
      <InfoRow label="시간대" value={data.timeContext} />
      {data.isDynamic && <InfoRow label="동적 조명" value="예" />}
    </div>
  );
}

function CoffeeDetail({ data }: { data: CoffeeDetailResponse }) {
  return (
    <div className="space-y-2 text-sm">
      <InfoRow label="캡슐명" value={data.capsuleName} />
      <InfoRow label="라인" value={data.line} />
      <InfoRow label="서브 카테고리" value={data.subCategory} />
      {data.intensity != null && (
        <InfoRow label="강도" value={`${data.intensity}${data.intensityMax ? ` / ${data.intensityMax}` : ''}`} />
      )}
      <InfoRow label="원두" value={data.beanType} />
      {data.origins.length > 0 && <InfoRow label="원산지" value={data.origins.join(', ')} />}
      <InfoRow label="로스팅" value={data.roastLevel} />
      {data.aromaProfile?.primary && data.aromaProfile.primary.length > 0 && (
        <InfoRow label="아로마" value={data.aromaProfile.primary.join(', ')} />
      )}
      <InfoRow label="풍미" value={data.flavorNotes} />
      {(data.body != null || data.bitterness != null || data.acidity != null) && (
        <div className="pt-1">
          <p className="mb-1 text-caption">프로필</p>
          <div className="flex gap-3 text-xs">
            {data.body != null && <span>바디 <strong>{data.body}</strong></span>}
            {data.bitterness != null && <span>쓴맛 <strong>{data.bitterness}</strong></span>}
            {data.acidity != null && <span>산미 <strong>{data.acidity}</strong></span>}
            {data.roasting != null && <span>로스팅 <strong>{data.roasting}</strong></span>}
          </div>
        </div>
      )}
      {data.cupSizes.length > 0 && (
        <InfoRow label="컵 사이즈" value={data.cupSizes.map((c) => `${c.type} (${c.ml}ml)`).join(', ')} />
      )}
      {data.pricePerCapsuleKrw != null && (
        <InfoRow label="가격" value={`₩${data.pricePerCapsuleKrw.toLocaleString()}`} />
      )}
      {(data.isDecaf || data.isLimitedEdition) && (
        <div className="flex gap-2 pt-1">
          {data.isDecaf && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">디카페인</span>}
          {data.isLimitedEdition && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">한정판</span>}
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */

export default function ItemDetailModal({ open, onClose, itemId, categoryKey, onArchive }: ItemDetailModalProps) {
  const [detail, setDetail] = useState<ItemDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyTrackResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const category = toItemCategory(categoryKey);

  useEffect(() => {
    if (!open) return;
    if (!category) {
      setLoading(false);
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    setDetail(null);
    setSpotifyData(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    getItemDetail(itemId, category)
      .then((data) => {
        setDetail(data);
        // 음악이면 항상 Spotify 데이터 조회 (DB 앨범커버가 유효하지 않을 수 있으므로)
        if (category === 'music') {
          const musicData = data as MusicDetailResponse;
          const nameIsKey = !musicData.itemName || /^(music|movie|lighting|coffee)_/.test(musicData.itemName);
          const hasReliableId = !!musicData.isrc || !!musicData.musicbrainzId;
          const searchQuery = !hasReliableId && !nameIsKey ? musicData.itemName : null;
          const searchArtist = !hasReliableId ? musicData.artists?.[0]?.name : undefined;

          if (hasReliableId || searchQuery) {
            searchSpotifyTrack({
              isrc: musicData.isrc ?? undefined,
              mbid: musicData.musicbrainzId ?? undefined,
              query: searchQuery,
              artist: searchArtist,
            })
              .then(setSpotifyData)
              .catch(() => {/* 무시 */});
          }
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, itemId, category]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      // 모달 닫힐 때 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [open, onClose]);

  const handlePlayPreview = useCallback((previewUrl: string) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    setIsPlaying(true);

    audio.play().catch(() => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));
  }, [isPlaying]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const categoryLabel = category ? CATEGORY_LABELS[category] ?? categoryKey : categoryKey;

  // 음악 전용 데이터 추출
  const isMusicItem = category === 'music' && detail && isMusic(detail, category);
  const musicDetail = isMusicItem ? (detail as MusicDetailResponse) : null;
  const albumCover = isMusicItem ? (spotifyData?.albumCoverUrl ?? null) : null;
  const previewUrl = spotifyData?.previewUrl ?? musicDetail?.previewUrl;
  const spotifyUrl = spotifyData?.spotifyUrl
    ?? (musicDetail?.spotifyUri
      ? `https://open.spotify.com/track/${musicDetail.spotifyUri.replace('spotify:track:', '')}`
      : null);

  // 상단 이미지: 음악이면 Spotify 앨범커버, 그 외는 일반 이미지
  const headerImage = isMusicItem ? albumCover : detail?.imageUrl;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-pretendard"
    >
      <div className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-card bg-white shadow-card">
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-low-emphasis transition-colors hover:bg-input hover:text-high-emphasis"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708Z" />
          </svg>
        </button>

        {/* 스크롤 영역 */}
        <div className="max-h-[85vh] overflow-y-auto">
          {/* 로딩 */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-stroke border-t-accent" />
            </div>
          )}

          {/* 에러 */}
          {error && !loading && (
            <div className="py-16 text-center">
              <p className="text-sm text-caption">아이템 정보를 불러올 수 없습니다.</p>
              <button onClick={onClose} className="mt-4 text-sm font-medium text-accent">닫기</button>
            </div>
          )}

          {/* 콘텐츠 */}
          {detail && !loading && (
            <>
              {/* 상단 이미지 (음악: 앨범커버, 영화: 포스터, 기타: 일반) */}
              {headerImage ? (
                <div className="relative w-full overflow-hidden bg-black/5">
                  <ImageWithFallback
                    src={headerImage}
                    alt={detail.itemName ?? '아이템'}
                    className={isMusicItem ? 'mx-auto h-64 w-64 object-cover' : 'h-52 w-full object-cover'}
                    placeholderClassName={isMusicItem ? 'flex h-64 w-64 mx-auto items-center justify-center' : 'flex h-52 w-full items-center justify-center'}
                  />
                  {/* 음악: 앨범 커버 위 미리듣기 오버레이 버튼 */}
                  {isMusicItem && previewUrl && (
                    <button
                      type="button"
                      onClick={() => handlePlayPreview(previewUrl)}
                      className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors ${
                        isPlaying
                          ? 'bg-accent text-white'
                          : 'bg-white/90 text-high-emphasis hover:bg-white'
                      }`}
                      title={isPlaying ? '정지' : '미리듣기'}
                    >
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  )}
                </div>
              ) : isMusicItem ? (
                /* 앨범 커버 없는 음악: 음표 아이콘 플레이스홀더 */
                <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
              ) : null}

              <div className="p-5">
                {/* 카테고리 배지 */}
                <span className="mb-2 inline-block rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-caption">
                  {categoryLabel}
                </span>

                {/* 타이틀 — itemKey 형태이면 Spotify 트랙명 사용 */}
                <h2 className="text-lg font-bold text-high-emphasis">
                  {(isMusicItem && spotifyData?.trackName && (!detail.itemName || /^(music|movie|lighting|coffee)_/.test(detail.itemName)))
                    ? spotifyData.trackName
                    : (detail.itemName ?? '이름 없음')}
                </h2>
                {detail.brand && (
                  <p className="mt-0.5 text-sm text-caption">{detail.brand}</p>
                )}
                {detail.description && (
                  <p className="mt-2 text-xs leading-relaxed text-caption">{detail.description}</p>
                )}

                {/* 구분선 */}
                <hr className="my-4 border-stroke" />

                {/* 도메인별 상세 */}
                {category && isMovie(detail, category) && <MovieDetail data={detail} />}
                {category && isMusic(detail, category) && <MusicDetailSection data={detail} spotifyData={spotifyData} />}
                {category && isLighting(detail, category) && <LightingDetail data={detail} />}
                {category && isCoffee(detail, category) && <CoffeeDetail data={detail} />}

                {/* 액션 버튼 */}
                <div className="mt-5 flex flex-col gap-2.5">
                  {/* Spotify 버튼 (음악 전용) */}
                  {isMusicItem && spotifyUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(spotifyUrl, '_blank')}
                      className="flex items-center justify-center gap-2 rounded-full bg-[#1DB954] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1ed760]"
                    >
                      <SpotifyIcon size={20} />
                      Spotify에서 듣기
                    </button>
                  )}

                  {/* 미리듣기 버튼 (음악 전용, Spotify URL 없을 때) */}
                  {isMusicItem && previewUrl && !spotifyUrl && (
                    <button
                      type="button"
                      onClick={() => handlePlayPreview(previewUrl)}
                      className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                        isPlaying
                          ? 'bg-accent text-white'
                          : 'bg-brand text-white hover:bg-brand/80'
                      }`}
                    >
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      {isPlaying ? '재생 중...' : '미리듣기'}
                    </button>
                  )}

                  <div className="flex gap-3">
                    {onArchive && (
                      <button
                        type="button"
                        onClick={() => { onArchive(); onClose(); }}
                        className="flex-1 rounded-full border border-stroke bg-white px-4 py-2.5 text-sm font-bold text-high-emphasis transition-opacity hover:bg-input"
                      >
                        아카이브 저장
                      </button>
                    )}
                    {detail.externalLink && !isMusicItem && (
                      <button
                        type="button"
                        onClick={() => window.open(detail.externalLink!, '_blank')}
                        className="flex-1 rounded-full bg-default px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
                      >
                        외부 링크 열기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
