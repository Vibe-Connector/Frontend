import { useMemo } from 'react';
import { MOOD_KEYWORDS, MAX_CUSTOM_MOODS, MAX_MOOD_SELECTIONS } from '../../constants';
import type { MoodKeyword } from '../../types';
import MoodCloudChip from './MoodCloudChip';
import MoodInputBubble from './MoodInputBubble';

interface MoodMindMapProps {
  selectedMoods: string[];
  customMoods: string[];
  onToggleMood: (moodId: string) => void;
  onAddCustomMood: (label: string) => void;
  onRemoveCustomMood: (label: string) => void;
  moods?: MoodKeyword[];
  isLimitReached?: boolean;
}

const CUSTOM_CLOUD_COLORS = ['#E8D5FF', '#D5F0E8', '#FFE8D5'];

/** N개 아이템을 중심 주위로 타원형 배치 */
function computeRadialPositions(count: number) {
  const positions: { top: string; left: string }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const rx = 32;
    const ry = 28;
    positions.push({
      top: `${50 + ry * Math.sin(angle)}%`,
      left: `${50 + rx * Math.cos(angle)}%`,
    });
  }
  return positions;
}

export default function MoodMindMap({
  selectedMoods,
  customMoods,
  onToggleMood,
  onAddCustomMood,
  onRemoveCustomMood,
  moods,
  isLimitReached = false,
}: MoodMindMapProps) {
  const displayMoods = moods ?? MOOD_KEYWORDS;

  const positions = useMemo(
    () => computeRadialPositions(displayMoods.length),
    [displayMoods.length],
  );

  return (
    <div className="relative w-full overflow-hidden rounded-card bg-vibe-bg" style={{ minHeight: '480px' }}>
      {/* Decorative doodles */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {/* Stars */}
        <text x="12%" y="15%" fontSize="20" opacity="0.3" className="fill-caption">&#10022;</text>
        <text x="88%" y="12%" fontSize="16" opacity="0.25" className="fill-caption">&#10022;</text>
        <text x="8%" y="75%" fontSize="14" opacity="0.2" className="fill-caption">&#10022;</text>
        <text x="92%" y="65%" fontSize="18" opacity="0.3" className="fill-caption">&#10022;</text>
        <text x="35%" y="90%" fontSize="12" opacity="0.2" className="fill-caption">&#9829;</text>
        <text x="75%" y="88%" fontSize="14" opacity="0.25" className="fill-caption">&#10022;</text>
        {/* Wavy lines */}
        <path d="M 60 200 Q 70 190 80 200 Q 90 210 100 200" fill="none" stroke="var(--color-caption)" strokeWidth="1.5" opacity="0.2" />
        <path d="M 700 150 Q 710 140 720 150 Q 730 160 740 150" fill="none" stroke="var(--color-caption)" strokeWidth="1.5" opacity="0.2" />
        <path d="M 200 400 Q 210 390 220 400 Q 230 410 240 400" fill="none" stroke="var(--color-caption)" strokeWidth="1.5" opacity="0.15" />
        {/* Small arrows */}
        <path d="M 150 250 L 170 245 L 165 260" fill="none" stroke="var(--color-caption)" strokeWidth="1.2" opacity="0.2" />
        <path d="M 650 300 L 670 295 L 665 310" fill="none" stroke="var(--color-caption)" strokeWidth="1.2" opacity="0.2" />
      </svg>

      {/* Limit reached notice */}
      {isLimitReached && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
          <p className="rounded-pill bg-brand/90 px-4 py-1.5 text-xs font-medium text-white">
            최대 {MAX_MOOD_SELECTIONS}개까지 선택 가능합니다
          </p>
        </div>
      )}

      {/* Center input bubble */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <MoodInputBubble
          onSubmit={onAddCustomMood}
          customCount={customMoods.length}
          maxCustom={MAX_CUSTOM_MOODS}
        />
      </div>

      {/* Preset mood clouds — 동적 배치 */}
      {displayMoods.map((mood, i) => {
        const isSelected = selectedMoods.includes(mood.id);
        return (
          <div
            key={mood.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              top: positions[i].top,
              left: positions[i].left,
            }}
          >
            <MoodCloudChip
              label={mood.label}
              color={mood.color}
              isSelected={isSelected}
              onClick={() => onToggleMood(mood.id)}
              disabled={isLimitReached && !isSelected}
            />
          </div>
        );
      })}

      {/* Custom mood clouds */}
      {customMoods.map((mood, i) => {
        const isSelected = selectedMoods.includes(`custom:${mood}`);
        return (
          <div
            key={`custom:${mood}`}
            className="absolute z-10"
            style={{
              bottom: `${12 + i * 8}%`,
              right: `${10 + i * 15}%`,
            }}
          >
            <MoodCloudChip
              label={mood}
              color={CUSTOM_CLOUD_COLORS[i % CUSTOM_CLOUD_COLORS.length]}
              isSelected={isSelected}
              onClick={() => onToggleMood(`custom:${mood}`)}
              disabled={isLimitReached && !isSelected}
              isCustom
              onRemove={() => onRemoveCustomMood(mood)}
            />
          </div>
        );
      })}
    </div>
  );
}
