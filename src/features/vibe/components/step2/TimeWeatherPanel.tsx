import { useEffect, useMemo } from 'react';
import TabToggle from '@/components/common/TabToggle';
import AnalogClock from './AnalogClock';
import WeatherSelector from './WeatherSelector';

interface TimeWeatherPanelProps {
  amPm: 'AM' | 'PM';
  selectedHour: number | null;
  selectedMinute: number;
  weatherIntensities: Record<string, number>;
  onAmPmChange: (v: 'AM' | 'PM') => void;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onWeatherIntensityChange: (weatherId: string, intensity: number) => void;
}

const AM_PM_TABS = [
  { key: 'AM' as const, label: 'AM' },
  { key: 'PM' as const, label: 'PM' },
];

/* ── Scene Config ── */

const TIME_SCENE_GRADIENTS: Record<string, string> = {
  dawn:      'linear-gradient(to top, #e8a87c 0%, #533483 60%, #1a1a2e 100%)',
  morning:   'linear-gradient(to top, #ffecd2 0%, #fcb69f 40%, #a1c4fd 100%)',
  afternoon: 'linear-gradient(to top, #e0f0ff 0%, #a1c4fd 50%, #74b9ff 100%)',
  evening:   'linear-gradient(to top, #302b63 0%, #c94b4b 50%, #f5af19 100%)',
  night:     'linear-gradient(to top, #0d1b2a 0%, #1b2838 50%, #1f4068 100%)',
};

const TIME_PERIOD_EMOJI: Record<string, string> = {
  dawn: '🌅', morning: '🌤', afternoon: '☀️', evening: '🌇', night: '🌙',
};

const TIME_PERIOD_LABEL: Record<string, string> = {
  dawn: '새벽', morning: '아침', afternoon: '낮', evening: '저녁', night: '밤',
};

const WEATHER_MODIFIERS: Record<string, { filter: string; overlayColor: string }> = {
  sunny:  { filter: 'brightness(1.1) saturate(1.1)',  overlayColor: 'transparent' },
  cloudy: { filter: 'brightness(0.85) saturate(0.8)', overlayColor: 'rgba(180,185,200,0.2)' },
  rainy:  { filter: 'brightness(0.7) saturate(0.7)',  overlayColor: 'rgba(100,120,160,0.25)' },
  snowy:  { filter: 'brightness(0.95) saturate(0.5)', overlayColor: 'rgba(220,230,255,0.3)' },
};

/* ── Weather Phrase System (5^4 = 625 combinations) ── */

const SKY_PHRASES: string[][] = [
  /* sunny=0 */ ['', '옅은 구름 낀', '구름 낀', '잔뜩 흐린', '먹구름 가득한'],
  /* sunny=1 */ ['살짝 맑은', '구름 사이 빛 새는', '엷은 햇살의', '흐린 하늘 빛 드는', '먹구름 틈 빛나는'],
  /* sunny=2 */ ['화창한', '구름 살짝 낀', '햇살과 구름의', '구름 많지만 밝은', '먹구름 속 햇빛 비치는'],
  /* sunny=3 */ ['눈부시게 맑은', '찬란한 햇살의', '빛나는 구름 사이', '강렬한 빛과 구름의', '먹구름 뚫는 강한 빛의'],
  /* sunny=4 */ ['작렬하는 햇살의', '뜨거운 빛과 구름의', '강렬한 햇빛 아래', '폭염 속 구름 낀', '먹구름과 불꽃 빛의'],
];

const PRECIP_PHRASES: string[][] = [
  /* rainy=0 */ ['', '가루눈 날리는', '함박눈 내리는', '눈보라 치는', '폭설의'],
  /* rainy=1 */ ['이슬비 내리는', '눈비 살짝 섞인', '가벼운 비와 눈의', '이슬비에 눈보라 이는', '이슬비 속 폭설의'],
  /* rainy=2 */ ['촉촉한 빗소리의', '빗속 눈 날리는', '비와 눈이 엇갈리는', '비바람과 눈의', '비 속 폭설의'],
  /* rainy=3 */ ['거센 비의', '폭우 속 눈 날리는', '거센 비와 눈의', '폭우와 눈보라의', '거센 비 속 폭설의'],
  /* rainy=4 */ ['폭우의', '폭우에 눈 섞인', '폭우 속 함박눈의', '폭우와 눈보라의', '대폭풍의'],
];

function quantizeLevel(intensity: number): number {
  return Math.min(4, Math.floor(intensity / 20));
}

function generateWeatherPhrase(intensities: Record<string, number>): string | null {
  const s = quantizeLevel(intensities['sunny'] ?? 0);
  const c = quantizeLevel(intensities['cloudy'] ?? 0);
  const r = quantizeLevel(intensities['rainy'] ?? 0);
  const n = quantizeLevel(intensities['snowy'] ?? 0);

  if (s === 0 && c === 0 && r === 0 && n === 0) return null;

  const sky = SKY_PHRASES[s][c];
  const precip = PRECIP_PHRASES[r][n];

  if (sky && precip) return `${sky} ${precip}`;
  return sky || precip || null;
}

const WEATHER_EMOJI: Record<string, string> = {
  sunny: '☀️', cloudy: '⛅', rainy: '🌧', snowy: '❄️',
};

/* ── Helpers ── */

function toHour24(hour: number, amPm: 'AM' | 'PM'): number {
  if (amPm === 'AM') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

function getTimePeriod(h24: number): string {
  if (h24 < 6) return 'dawn';
  if (h24 < 12) return 'morning';
  if (h24 < 18) return 'afternoon';
  if (h24 < 21) return 'evening';
  return 'night';
}

function getTopWeather(intensities: Record<string, number>): string | null {
  const active = Object.entries(intensities).filter(([, v]) => v > 0);
  if (active.length === 0) return null;
  return active.sort(([, a], [, b]) => b - a)[0][0];
}

/* ── Component ── */

export default function TimeWeatherPanel({
  amPm,
  selectedHour,
  selectedMinute,
  weatherIntensities,
  onAmPmChange,
  onHourChange,
  onMinuteChange,
  onWeatherIntensityChange,
}: TimeWeatherPanelProps) {
  /* 현재 시간 자동 감지 (프리필) */
  useEffect(() => {
    if (selectedHour !== null) return;
    const now = new Date();
    const h = now.getHours();
    const m = Math.round(now.getMinutes() / 5) * 5 % 60;
    onAmPmChange(h < 12 ? 'AM' : 'PM');
    onHourChange(h % 12 === 0 ? 12 : h % 12);
    onMinuteChange(m);
  }, [selectedHour, onAmPmChange, onHourChange, onMinuteChange]);

  /* Scene 계산 */
  const selectedPeriod = useMemo(() => {
    if (selectedHour === null) return null;
    return getTimePeriod(toHour24(selectedHour, amPm));
  }, [selectedHour, amPm]);

  const topWeather = useMemo(() => getTopWeather(weatherIntensities), [weatherIntensities]);

  const sceneGradient = selectedPeriod
    ? TIME_SCENE_GRADIENTS[selectedPeriod]
    : 'linear-gradient(135deg, #f0ebe3 0%, #e8e0d4 100%)';
  const weatherMod = topWeather ? WEATHER_MODIFIERS[topWeather] : null;

  const sceneEmoji = topWeather
    ? WEATHER_EMOJI[topWeather]
    : selectedPeriod
      ? TIME_PERIOD_EMOJI[selectedPeriod]
      : null;

  const weatherPhrase = useMemo(() => generateWeatherPhrase(weatherIntensities), [weatherIntensities]);

  const sceneLabel = selectedPeriod
    ? weatherPhrase
      ? `${weatherPhrase} ${TIME_PERIOD_LABEL[selectedPeriod]}`
      : TIME_PERIOD_LABEL[selectedPeriod]
    : null;

  return (
    <div className="rounded-card bg-vibe-bg p-6 md:p-8">
      {/* Header */}
      <h2 className="text-xl font-bold tracking-[-0.5px] text-high-emphasis">
        지금 당신의 환경은?
      </h2>
      <p className="mt-1 text-sm text-caption">
        시간과 날씨를 조절하면 풍경이 바뀌어요
      </p>

      {/* Scene Preview */}
      <div className="relative mt-6 overflow-hidden rounded-card" style={{ height: '160px' }}>
        <div
          className="absolute inset-0 animate-smooth"
          style={{
            background: sceneGradient,
            filter: weatherMod?.filter ?? 'none',
          }}
        />
        {weatherMod && weatherMod.overlayColor !== 'transparent' && (
          <div
            className="absolute inset-0 animate-smooth"
            style={{ backgroundColor: weatherMod.overlayColor }}
          />
        )}
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          {sceneEmoji ? (
            <>
              <span className="text-5xl drop-shadow-lg">{sceneEmoji}</span>
              {sceneLabel && (
                <p
                  className="mt-2 text-lg font-semibold text-white"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                >
                  {sceneLabel}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-caption">풍경을 그려보세요</p>
          )}
        </div>
      </div>

      {/* Clock + Weather */}
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: AM/PM + Clock */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-fit">
            <TabToggle tabs={AM_PM_TABS} activeTab={amPm} onChange={onAmPmChange} />
          </div>
          <AnalogClock
            amPm={amPm}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            onHourChange={onHourChange}
            onMinuteChange={onMinuteChange}
          />
        </div>

        {/* Right: Weather */}
        <div className="flex flex-col justify-center">
          <WeatherSelector
            weatherIntensities={weatherIntensities}
            onWeatherIntensityChange={onWeatherIntensityChange}
          />
        </div>
      </div>
    </div>
  );
}
