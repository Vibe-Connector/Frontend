import { MOOD_KEYWORDS, MAX_CUSTOM_MOODS } from '../../constants';
import MoodCloudChip from './MoodCloudChip';
import MoodInputBubble from './MoodInputBubble';

interface MoodMindMapProps {
  selectedMoods: string[];
  customMoods: string[];
  onToggleMood: (moodId: string) => void;
  onAddCustomMood: (label: string) => void;
  onRemoveCustomMood: (label: string) => void;
}

const CUSTOM_CLOUD_COLORS = ['#E8D5FF', '#D5F0E8', '#FFE8D5'];

const RADIAL_POSITIONS = [
  { top: '8%', left: '30%' },
  { top: '8%', left: '65%' },
  { top: '38%', left: '10%' },
  { top: '38%', left: '82%' },
  { top: '68%', left: '25%' },
  { top: '68%', left: '60%' },
];

export default function MoodMindMap({
  selectedMoods,
  customMoods,
  onToggleMood,
  onAddCustomMood,
  onRemoveCustomMood,
}: MoodMindMapProps) {
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

      {/* Center input bubble */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <MoodInputBubble
          onSubmit={onAddCustomMood}
          customCount={customMoods.length}
          maxCustom={MAX_CUSTOM_MOODS}
        />
      </div>

      {/* Preset mood clouds */}
      {MOOD_KEYWORDS.map((mood, i) => (
        <div
          key={mood.id}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{
            top: RADIAL_POSITIONS[i].top,
            left: RADIAL_POSITIONS[i].left,
          }}
        >
          <MoodCloudChip
            label={mood.label}
            color={mood.color}
            isSelected={selectedMoods.includes(mood.id)}
            onClick={() => onToggleMood(mood.id)}
          />
        </div>
      ))}

      {/* Custom mood clouds */}
      {customMoods.map((mood, i) => (
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
            isSelected={selectedMoods.includes(`custom:${mood}`)}
            onClick={() => onToggleMood(`custom:${mood}`)}
            isCustom
            onRemove={() => onRemoveCustomMood(mood)}
          />
        </div>
      ))}
    </div>
  );
}
