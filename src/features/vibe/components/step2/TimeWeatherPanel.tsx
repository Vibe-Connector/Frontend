import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

const TIME_PERIOD_KEY: Record<string, string> = {
  dawn: 'vibe.timeDawn', morning: 'vibe.timeMorning', afternoon: 'vibe.timeAfternoon', evening: 'vibe.timeEvening', night: 'vibe.timeNight',
};

const WEATHER_MODIFIERS: Record<string, { filter: string; overlayColor: string }> = {
  sunny:  { filter: 'brightness(1.1) saturate(1.1)',  overlayColor: 'transparent' },
  cloudy: { filter: 'brightness(0.85) saturate(0.8)', overlayColor: 'rgba(180,185,200,0.2)' },
  rainy:  { filter: 'brightness(0.7) saturate(0.7)',  overlayColor: 'rgba(100,120,160,0.25)' },
  snowy:  { filter: 'brightness(0.95) saturate(0.5)', overlayColor: 'rgba(220,230,255,0.3)' },
};

/* ── Weather Phrase System (5^4 = 625 combinations via i18n) ── */

const SKY_KEYS: string[][] = [
  ['', 'vibe.sky_0_1', 'vibe.sky_0_2', 'vibe.sky_0_3', 'vibe.sky_0_4'],
  ['vibe.sky_1_0', 'vibe.sky_1_1', 'vibe.sky_1_2', 'vibe.sky_1_3', 'vibe.sky_1_4'],
  ['vibe.sky_2_0', 'vibe.sky_2_1', 'vibe.sky_2_2', 'vibe.sky_2_3', 'vibe.sky_2_4'],
  ['vibe.sky_3_0', 'vibe.sky_3_1', 'vibe.sky_3_2', 'vibe.sky_3_3', 'vibe.sky_3_4'],
  ['vibe.sky_4_0', 'vibe.sky_4_1', 'vibe.sky_4_2', 'vibe.sky_4_3', 'vibe.sky_4_4'],
];

const PRECIP_KEYS: string[][] = [
  ['', 'vibe.precip_0_1', 'vibe.precip_0_2', 'vibe.precip_0_3', 'vibe.precip_0_4'],
  ['vibe.precip_1_0', 'vibe.precip_1_1', 'vibe.precip_1_2', 'vibe.precip_1_3', 'vibe.precip_1_4'],
  ['vibe.precip_2_0', 'vibe.precip_2_1', 'vibe.precip_2_2', 'vibe.precip_2_3', 'vibe.precip_2_4'],
  ['vibe.precip_3_0', 'vibe.precip_3_1', 'vibe.precip_3_2', 'vibe.precip_3_3', 'vibe.precip_3_4'],
  ['vibe.precip_4_0', 'vibe.precip_4_1', 'vibe.precip_4_2', 'vibe.precip_4_3', 'vibe.precip_4_4'],
];

function quantizeLevel(intensity: number): number {
  return Math.min(4, Math.floor(intensity / 20));
}

function generateWeatherPhrase(intensities: Record<string, number>, t: (key: string) => string): string | null {
  const s = quantizeLevel(intensities['sunny'] ?? 0);
  const c = quantizeLevel(intensities['cloudy'] ?? 0);
  const r = quantizeLevel(intensities['rainy'] ?? 0);
  const n = quantizeLevel(intensities['snowy'] ?? 0);

  if (s === 0 && c === 0 && r === 0 && n === 0) return null;

  const skyKey = SKY_KEYS[s][c];
  const precipKey = PRECIP_KEYS[r][n];
  const sky = skyKey ? t(skyKey) : '';
  const precip = precipKey ? t(precipKey) : '';

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
  const { t } = useTranslation();
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

  const weatherPhrase = useMemo(() => generateWeatherPhrase(weatherIntensities, t), [weatherIntensities, t]);

  const sceneLabel = selectedPeriod
    ? weatherPhrase
      ? `${weatherPhrase} ${t(TIME_PERIOD_KEY[selectedPeriod])}`
      : t(TIME_PERIOD_KEY[selectedPeriod])
    : null;

  return (
    <div className="rounded-card bg-vibe-bg p-6 md:p-8">
      {/* Header */}
      <h2 className="text-xl font-bold tracking-[-0.5px] text-high-emphasis">
        {t('vibe.envQuestion')}
      </h2>
      <p className="mt-1 text-sm text-caption">
        {t('vibe.envSubtitle')}
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
            <p className="text-sm text-caption">{t('vibe.drawScene')}</p>
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
