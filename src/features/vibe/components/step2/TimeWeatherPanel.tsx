import TabToggle from '@/components/common/TabToggle';
import AnalogClock from './AnalogClock';
import WeatherSelector from './WeatherSelector';

interface TimeWeatherPanelProps {
  amPm: 'AM' | 'PM';
  selectedTimeSlot: string | null;
  selectedWeather: string | null;
  onAmPmChange: (v: 'AM' | 'PM') => void;
  onTimeSlotChange: (id: string) => void;
  onWeatherChange: (id: string) => void;
}

const AM_PM_TABS = [
  { key: 'AM' as const, label: 'AM' },
  { key: 'PM' as const, label: 'PM' },
];

export default function TimeWeatherPanel({
  amPm,
  selectedTimeSlot,
  selectedWeather,
  onAmPmChange,
  onTimeSlotChange,
  onWeatherChange,
}: TimeWeatherPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Left: AM/PM + Clock */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-fit">
          <TabToggle tabs={AM_PM_TABS} activeTab={amPm} onChange={onAmPmChange} />
        </div>
        <AnalogClock amPm={amPm} selectedTimeSlot={selectedTimeSlot} onTimeSlotSelect={onTimeSlotChange} />
      </div>

      {/* Right: Weather */}
      <div className="flex flex-col justify-center">
        <WeatherSelector selectedWeather={selectedWeather} onWeatherChange={onWeatherChange} />
      </div>
    </div>
  );
}
