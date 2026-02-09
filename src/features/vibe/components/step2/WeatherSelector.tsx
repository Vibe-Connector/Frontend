import { WEATHER_OPTIONS } from '../../constants';

interface WeatherSelectorProps {
  selectedWeather: string | null;
  onWeatherChange: (id: string) => void;
}

function WeatherIcon({ icon, isSelected }: { icon: string; isSelected: boolean }) {
  const color = isSelected ? 'var(--color-primary)' : 'var(--color-caption)';

  switch (icon) {
    case 'sun':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 16 + 9 * Math.cos(rad);
            const y1 = 16 + 9 * Math.sin(rad);
            const x2 = 16 + 12 * Math.cos(rad);
            const y2 = 16 + 12 * Math.sin(rad);
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />;
          })}
        </svg>
      );
    case 'cloud':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 22a5 5 0 0 1-.8-9.9A7 7 0 0 1 21 11a5 5 0 0 1 3 9H8z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'rain':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 18a5 5 0 0 1-.8-9.9A7 7 0 0 1 21 7a5 5 0 0 1 3 9H8z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <line x1="10" y1="22" x2="10" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="22" x2="16" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="22" x2="22" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'snow':
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 18a5 5 0 0 1-.8-9.9A7 7 0 0 1 21 7a5 5 0 0 1 3 9H8z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="10" cy="23" r="1.5" fill={color} />
          <circle cx="16" cy="25" r="1.5" fill={color} />
          <circle cx="22" cy="23" r="1.5" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

export default function WeatherSelector({ selectedWeather, onWeatherChange }: WeatherSelectorProps) {
  return (
    <div className="rounded-card bg-surface p-6">
      <h3 className="mb-4 text-center text-sm font-medium text-high-emphasis">
        오늘의 날씨는 어때요?
      </h3>
      <div className="flex flex-col gap-4">
        {WEATHER_OPTIONS.map((weather) => {
          const isSelected = selectedWeather === weather.id;

          return (
            <button
              key={weather.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onWeatherChange(weather.id)}
              className={`flex items-center gap-4 rounded-control p-3 animate-smooth cursor-pointer ${
                isSelected
                  ? 'bg-white shadow-card'
                  : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <WeatherIcon icon={weather.icon} isSelected={isSelected} />
              <span className={`text-sm font-medium animate-smooth ${isSelected ? 'text-high-emphasis' : 'text-caption'}`}>
                {weather.label}
              </span>
              <div className="ml-auto h-2 flex-1 max-w-[120px] overflow-hidden rounded-pill bg-disabled">
                <div
                  className="h-full rounded-pill animate-smooth"
                  style={{
                    width: isSelected ? '100%' : '0%',
                    background: isSelected
                      ? 'linear-gradient(90deg, #FFD6E0, #F1863B)'
                      : 'transparent',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
