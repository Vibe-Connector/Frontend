import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MOOD_KEYWORDS,
  MAX_CUSTOM_MOODS,
  MAX_MOOD_SELECTIONS,
  EMOTION_ZONES,
  MOOD_ZONE_MAP,
} from '../../constants';
import type { MoodKeyword, EmotionZone } from '../../types';
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

const ZONE_ORDER: EmotionZone[] = ['warm', 'energy', 'calm', 'melancholy', 'dream'];
const CUSTOM_TAG_COLOR = '#EDEEEF';

export default function MoodMindMap({
  selectedMoods,
  customMoods,
  onToggleMood,
  onAddCustomMood,
  onRemoveCustomMood,
  moods,
  isLimitReached = false,
}: MoodMindMapProps) {
  const { t } = useTranslation();
  const displayMoods = moods ?? MOOD_KEYWORDS;

  const groupedMoods = useMemo(() => {
    const groups: Record<EmotionZone, MoodKeyword[]> = {
      warm: [],
      energy: [],
      calm: [],
      melancholy: [],
      dream: [],
    };
    for (const mood of displayMoods) {
      const zone = mood.zone ?? MOOD_ZONE_MAP[mood.id] ?? 'calm';
      groups[zone].push(mood);
    }
    return groups;
  }, [displayMoods]);

  const selectionCount = selectedMoods.length;

  return (
    <div className="rounded-card bg-vibe-bg p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.5px] text-high-emphasis">
            {t('vibe.moodQuestion')}
          </h2>
          <p className="mt-1 text-sm text-caption">
            {t('vibe.moodSubtitle')}
          </p>
        </div>
        <div
          className="shrink-0 rounded-pill px-3.5 py-1.5 text-sm font-semibold animate-smooth"
          style={{
            backgroundColor: selectionCount > 0 ? 'var(--color-accent)' : 'white',
            color: selectionCount > 0 ? 'white' : 'var(--color-caption)',
          }}
        >
          {selectionCount}/{MAX_MOOD_SELECTIONS}
        </div>
      </div>

      {/* Zone groups */}
      <div className="mt-6 space-y-5">
        {ZONE_ORDER.map((zone) => {
          const zoneMoods = groupedMoods[zone];
          if (zoneMoods.length === 0) return null;
          const zoneConfig = EMOTION_ZONES[zone];

          return (
            <div key={zone}>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-caption/70">
                {zoneConfig.label}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {zoneMoods.map((mood) => (
                  <MoodCloudChip
                    key={mood.id}
                    label={mood.label}
                    color={mood.color}
                    isSelected={selectedMoods.includes(mood.id)}
                    onClick={() => onToggleMood(mood.id)}
                    disabled={isLimitReached && !selectedMoods.includes(mood.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider — "또는 직접 표현하기" */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stroke/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-vibe-bg px-3 text-xs text-caption">
            {t('vibe.customMood')}
          </span>
        </div>
      </div>

      {/* Custom mood input */}
      <MoodInputBubble
        onSubmit={onAddCustomMood}
        customCount={customMoods.length}
        maxCustom={MAX_CUSTOM_MOODS}
        disabled={isLimitReached}
      />

      {/* Custom mood tags */}
      {customMoods.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {customMoods.map((mood) => (
            <span
              key={`custom:${mood}`}
              className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-medium text-high-emphasis animate-smooth"
              style={{ backgroundColor: CUSTOM_TAG_COLOR }}
            >
              {mood}
              <button
                type="button"
                onClick={() => onRemoveCustomMood(mood)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-caption hover:text-high-emphasis"
                aria-label={`${mood} 삭제`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Limit notice */}
      {isLimitReached && (
        <p className="mt-5 text-center text-xs font-medium text-accent">
          최대 {MAX_MOOD_SELECTIONS}개까지 선택할 수 있어요
        </p>
      )}
    </div>
  );
}
