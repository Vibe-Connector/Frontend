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
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
  );
}
