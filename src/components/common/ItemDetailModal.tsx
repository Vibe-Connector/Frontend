import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getItemDetail, type ItemCategory, type ItemDetailResponse } from '@/api/item';
import type {
  MovieDetailResponse,
  MusicDetailResponse,
  LightingDetailResponse,
  CoffeeDetailResponse,
} from '@/api/types';
import { searchSpotifyTrack, type SpotifyTrackResponse } from '@/api/spotify';
import ImageWithFallback from './ImageWithFallback';

/* ── Props ── */

export interface ItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
  categoryKey: string;
  onArchive?: () => void;
  recommendReason?: string | null;
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

/** itemName(한국어)이 없을 때 도메인별 원제/원명으로 폴백 */
function getDisplayName(detail: ItemDetailResponse, category: ItemCategory | null, noName: string): string {
  if (detail.itemName) return detail.itemName;
  if (category === 'movie' && isMovie(detail, category)) {
    return detail.originalTitle ?? noName;
  }
  if (category === 'music' && isMusic(detail, category)) {
    return detail.albumName ?? detail.artists[0]?.name ?? noName;
  }
  if (category === 'coffee' && isCoffee(detail, category)) {
    return detail.capsuleName ?? noName;
  }
  if (category === 'lighting' && isLighting(detail, category)) {
    return detail.lightingType ?? detail.lightColor ?? noName;
  }
  return noName;
}

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

/* ── 줄거리 더보기 ── */

function ExpandableText({ text, label }: { text: string; label?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      setTruncated(ref.current.scrollHeight > ref.current.clientHeight + 1);
    }
  }, [text]);

  return (
    <div className="mt-2">
      {label && <p className="mb-1 text-xs text-caption">{label}</p>}
      <p
        ref={ref}
        className={`text-xs leading-relaxed text-high-emphasis ${!expanded ? 'line-clamp-3' : ''}`}
      >
        {text}
      </p>
      {(truncated || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-accent"
        >
          {expanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
}

/* ── 영화 줄거리 (더보기 → Wikipedia) ── */

function MovieOverviewText({ text, movieTitle }: { text: string; movieTitle: string }) {
  const { t } = useTranslation();
  const [truncated, setTruncated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      setTruncated(ref.current.scrollHeight > ref.current.clientHeight + 1);
    }
  }, [text]);

  const wikiUrl = `https://ko.wikipedia.org/w/index.php?search=${encodeURIComponent(movieTitle)}`;

  return (
    <div className="mt-2">
      <p ref={ref} className="line-clamp-3 text-xs leading-relaxed text-high-emphasis">
        {text}
      </p>
      {truncated && (
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
        >
          {t('itemDetail.moreWiki')}
        </a>
      )}
    </div>
  );
}

/* ── 도메인별 상세 섹션 ── */

function MovieDetail({ data }: { data: MovieDetailResponse }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-sm">
      {data.originalTitle && <InfoRow label={t('itemDetail.originalTitle')} value={data.originalTitle} />}
      {data.contentType && <InfoRow label={t('itemDetail.type')} value={data.contentType === 'TV' ? t('itemDetail.tvSeries') : t('itemDetail.movie')} />}
      <InfoRow label={t('itemDetail.releaseDate')} value={data.releaseDate} />
      <InfoRow label={t('itemDetail.runtime')} value={data.runtime ? `${data.runtime}${t('itemDetail.minutes')}` : null} />
      <InfoRow label={t('itemDetail.rating')} value={data.voteAverage ? `${data.voteAverage.toFixed(1)} (${data.voteCount?.toLocaleString()}명)` : null} />
      {data.genres.length > 0 && <InfoRow label={t('itemDetail.genre')} value={data.genres.join(', ')} />}
      {data.castInfo.length > 0 && (
        <div className="pt-1">
          <p className="mb-1 text-caption">{t('itemDetail.cast')}</p>
          <div className="flex flex-wrap gap-1">
            {data.castInfo.slice(0, 6).map((c) => (
              <span key={c.name} className="rounded-full bg-surface px-2 py-0.5 text-xs text-high-emphasis">
                {c.name}{c.role ? ` (${c.role})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MusicDetail({ data }: { data: MusicDetailResponse }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-sm">
      {data.artists.length > 0 && <InfoRow label={t('itemDetail.artist')} value={data.artists.map((a) => a.name).join(', ')} />}
      <InfoRow label={t('itemDetail.album')} value={data.albumName} />
      {data.genres.length > 0 && <InfoRow label={t('itemDetail.genre')} value={data.genres.join(', ')} />}
      <InfoRow label={t('itemDetail.releaseDate')} value={data.releaseDate} />
      <InfoRow label={t('itemDetail.playTime')} value={data.trackDurationMs ? formatMs(data.trackDurationMs) : null} />
      <InfoRow label={t('itemDetail.type')} value={data.contentType} />
    </div>
  );
}

function LightingDetail({ data }: { data: LightingDetailResponse }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-sm">
      <InfoRow label={t('itemDetail.lightingType')} value={data.lightingType} />
      <InfoRow label={t('itemDetail.color')} value={data.lightColor} />
      <InfoRow label={t('itemDetail.colorTemp')} value={data.colorTempKelvin ? `${data.colorTempKelvin}K${data.colorTempName ? ` (${data.colorTempName})` : ''}` : data.colorTempName} />
      <InfoRow label={t('itemDetail.brightness')} value={data.brightnessPercent ? `${data.brightnessPercent}%${data.brightnessLevel ? ` (${data.brightnessLevel})` : ''}` : data.brightnessLevel} />
      <InfoRow label={t('itemDetail.position')} value={data.position} />
      <InfoRow label={t('itemDetail.space')} value={data.spaceContext} />
      <InfoRow label={t('itemDetail.timeContext')} value={data.timeContext} />
      {data.isDynamic && <InfoRow label={t('itemDetail.dynamicLighting')} value={t('common.yes')} />}
    </div>
  );
}

function CoffeeDetail({ data }: { data: CoffeeDetailResponse }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-sm">
      <InfoRow label={t('itemDetail.capsuleName')} value={data.capsuleName} />
      <InfoRow label={t('itemDetail.line')} value={data.line} />
      <InfoRow label={t('itemDetail.subCategory')} value={data.subCategory} />
      {data.intensity != null && (
        <InfoRow label={t('itemDetail.intensity')} value={`${data.intensity}${data.intensityMax ? ` / ${data.intensityMax}` : ''}`} />
      )}
      <InfoRow label={t('itemDetail.bean')} value={data.beanType} />
      {data.origins.length > 0 && <InfoRow label={t('itemDetail.origin')} value={data.origins.join(', ')} />}
      <InfoRow label={t('itemDetail.roasting')} value={data.roastLevel} />
      {data.aromaProfile?.primary && data.aromaProfile.primary.length > 0 && (
        <InfoRow label={t('itemDetail.aroma')} value={data.aromaProfile.primary.join(', ')} />
      )}
      <InfoRow label={t('itemDetail.flavor')} value={data.flavorNotes} />
      {(data.body != null || data.bitterness != null || data.acidity != null) && (
        <div className="pt-1">
          <p className="mb-1 text-caption">{t('itemDetail.profileLabel')}</p>
          <div className="flex gap-3 text-xs">
            {data.body != null && <span>{t('itemDetail.body')} <strong>{data.body}</strong></span>}
            {data.bitterness != null && <span>{t('itemDetail.bitterness')} <strong>{data.bitterness}</strong></span>}
            {data.acidity != null && <span>{t('itemDetail.acidity')} <strong>{data.acidity}</strong></span>}
            {data.roasting != null && <span>{t('itemDetail.roasting')} <strong>{data.roasting}</strong></span>}
          </div>
        </div>
      )}
      {data.cupSizes.length > 0 && (
        <InfoRow label={t('itemDetail.cupSize')} value={data.cupSizes.map((c) => `${c.type} (${c.ml}ml)`).join(', ')} />
      )}
      {data.pricePerCapsuleKrw != null && (
        <InfoRow label={t('itemDetail.price')} value={`₩${data.pricePerCapsuleKrw.toLocaleString()}`} />
      )}
      {(data.isDecaf || data.isLimitedEdition) && (
        <div className="flex gap-2 pt-1">
          {data.isDecaf && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">{t('itemDetail.decaf')}</span>}
          {data.isLimitedEdition && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{t('itemDetail.limited')}</span>}
        </div>
      )}
    </div>
  );
}

/* ── 액션 버튼 ── */

function ActionButtons({ onArchive, externalLink, onClose }: { onArchive?: () => void; externalLink?: string | null; onClose: () => void }) {
  const { t } = useTranslation();
  if (!onArchive && !externalLink) return null;
  return (
    <div className="mt-5 flex gap-3">
      {onArchive && (
        <button
          type="button"
          onClick={() => { onArchive(); onClose(); }}
          className="flex-1 rounded-full border border-stroke bg-white px-4 py-2.5 text-sm font-bold text-high-emphasis transition-opacity hover:bg-input"
        >
          {t('modal.archiveSave')}
        </button>
      )}
      {externalLink && (
        <button
          type="button"
          onClick={() => window.open(externalLink, '_blank')}
          className="flex-1 rounded-full bg-default px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
        >
          {t('modal.externalLink')}
        </button>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */

export default function ItemDetailModal({ open, onClose, itemId, categoryKey, onArchive, recommendReason }: ItemDetailModalProps) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<ItemDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyTrackResponse | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const category = toItemCategory(categoryKey);
  const isMovieCategory = category === 'movie';
  const noName = t('common.noName');

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
    getItemDetail(itemId, category)
      .then((data) => {
        setDetail(data);
        // 음악이면 항상 Spotify API로 앨범커버·트랙명 조회
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
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const categoryLabel = category ? CATEGORY_LABELS[category] ?? categoryKey : categoryKey;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-pretendard"
    >
      <div className={`relative w-full overflow-hidden rounded-card bg-white shadow-card ${(isMovieCategory || category === 'music') ? 'h-125 max-w-3xl' : 'max-h-[85vh] max-w-md'}`}>
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label={t('common.close')}
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-low-emphasis transition-colors hover:bg-input hover:text-high-emphasis"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708Z" />
          </svg>
        </button>

        {/* 로딩 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stroke border-t-accent" />
          </div>
        )}

        {/* 에러 */}
        {error && !loading && (
          <div className="py-16 text-center">
            <p className="text-sm text-caption">{t('modal.errorLoad')}</p>
            <button onClick={onClose} className="mt-4 text-sm font-medium text-accent">{t('common.close')}</button>
          </div>
        )}

        {/* 콘텐츠 — 영화·음악: 2컬럼, 나머지: 세로 레이아웃 */}
        {detail && !loading && (
          isMovieCategory && isMovie(detail, category!) ? (
            /* ── 영화: 포스터 좌측 + 정보 우측 ── */
            <div className="flex h-full">
              {detail.imageUrl && (
                <div className="w-80 shrink-0">
                  <ImageWithFallback
                    src={detail.imageUrl}
                    alt={getDisplayName(detail, category, noName)}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-5">
                <span className="mb-2 inline-block w-fit rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-caption">
                  {categoryLabel}
                </span>
                <h2 className="text-lg font-bold text-high-emphasis">{getDisplayName(detail, category, noName)}</h2>
                {detail.brand && <p className="mt-0.5 text-sm text-caption">{detail.brand}</p>}
                {detail.description && (
                  <MovieOverviewText text={detail.description} movieTitle={getDisplayName(detail, category, noName)} />
                )}
                {recommendReason && (
                  <p className="mt-2 text-xs leading-relaxed text-accent">{t('modal.recommendReason')}: {recommendReason}</p>
                )}
                <hr className="my-4 border-stroke" />
                <MovieDetail data={detail} />
                <ActionButtons onArchive={onArchive} externalLink={detail.externalLink} onClose={onClose} />
              </div>
            </div>
          ) : category === 'music' && isMusic(detail, category!) ? (
            /* ── 음악: 앨범커버 좌측 + 정보 우측 ── */
            <div className="flex h-full">
              <div className="flex w-80 shrink-0 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                {spotifyData?.albumCoverUrl ? (
                  <img
                    src={spotifyData.albumCoverUrl}
                    alt={spotifyData.trackName ?? detail.itemName ?? noName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-5">
                <span className="mb-2 inline-block w-fit rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-caption">
                  {categoryLabel}
                </span>
                <h2 className="text-lg font-bold text-high-emphasis">
                  {spotifyData?.trackName || getDisplayName(detail, category, noName)}
                </h2>
                {spotifyData?.artists && spotifyData.artists.length > 0 && (
                  <p className="mt-0.5 text-sm text-caption">{spotifyData.artists.join(', ')}</p>
                )}
                {recommendReason && (
                  <p className="mt-2 text-xs leading-relaxed text-accent">{t('modal.recommendReason')}: {recommendReason}</p>
                )}
                <hr className="my-4 border-stroke" />
                <MusicDetail data={detail} />
                <ActionButtons onArchive={onArchive} externalLink={spotifyData?.spotifyUrl ?? detail.externalLink} onClose={onClose} />
              </div>
            </div>
          ) : (
            /* ── 커피·조명: 기존 세로 레이아웃 ── */
            <div className="max-h-[85vh] overflow-y-auto">
              {detail.imageUrl && (
                <div className="w-full overflow-hidden">
                  <ImageWithFallback
                    src={detail.imageUrl}
                    alt={detail.itemName ?? noName}
                    className="h-52 w-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <span className="mb-2 inline-block rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-caption">
                  {categoryLabel}
                </span>
                <h2 className="text-lg font-bold text-high-emphasis">{getDisplayName(detail, category, noName)}</h2>
                {detail.brand && <p className="mt-0.5 text-sm text-caption">{detail.brand}</p>}
                {detail.description && <ExpandableText text={detail.description} />}
                {recommendReason && (
                  <p className="mt-2 text-xs leading-relaxed text-accent">{t('modal.recommendReason')}: {recommendReason}</p>
                )}
                <hr className="my-4 border-stroke" />
                {category && isLighting(detail, category) && <LightingDetail data={detail} />}
                {category && isCoffee(detail, category) && <CoffeeDetail data={detail} />}
                <ActionButtons onArchive={onArchive} externalLink={detail.externalLink} onClose={onClose} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
