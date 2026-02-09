import { TIME_OPTIONS } from '../../constants';

interface AnalogClockProps {
  amPm: 'AM' | 'PM';
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (timeId: string) => void;
}

function hourToAngle(hour: number): number {
  return ((hour % 12) / 12) * 360 - 90;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

const SECTOR_COLORS: Record<string, string> = {
  dawn: '#D9D4FF',
  morning: '#FFF0C8',
  afternoon: '#FFD6E0',
  evening: '#FFD4C4',
  night: '#C8E6FF',
};

const CX = 150;
const CY = 150;
const R = 120;

export default function AnalogClock({ amPm, selectedTimeSlot, onTimeSlotSelect }: AnalogClockProps) {
  const filteredOptions = TIME_OPTIONS.filter((opt) => {
    if (amPm === 'AM') return opt.hourStart < 12;
    return opt.hourStart >= 12;
  });

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
        {/* Clock face */}
        <circle cx={CX} cy={CY} r={R + 5} fill="white" stroke="var(--color-stroke)" strokeWidth="2" />

        {/* Time slot sectors */}
        {filteredOptions.map((opt) => {
          const startH = opt.hourStart % 12;
          const endH = opt.hourEnd === 24 ? 12 : opt.hourEnd % 12;
          const startAngle = hourToAngle(startH);
          const endAngle = hourToAngle(endH === 0 ? 12 : endH);
          const adjustedEnd = endAngle <= startAngle ? endAngle + 360 : endAngle;
          const isSelected = selectedTimeSlot === opt.id;

          return (
            <path
              key={opt.id}
              d={describeArc(CX, CY, R - 2, startAngle, adjustedEnd)}
              fill={isSelected ? SECTOR_COLORS[opt.id] : 'transparent'}
              stroke={isSelected ? 'var(--color-primary)' : 'transparent'}
              strokeWidth="1"
              className="cursor-pointer animate-smooth hover:opacity-70"
              onClick={() => onTimeSlotSelect(opt.id)}
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.label}
            />
          );
        })}

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 360 - 90;
          const outerP = polarToCartesian(CX, CY, R - 2, angle);
          const innerP = polarToCartesian(CX, CY, R - (i % 3 === 0 ? 18 : 10), angle);
          const labelP = polarToCartesian(CX, CY, R - 28, angle);
          const hour = i === 0 ? 12 : i;

          return (
            <g key={i}>
              <line
                x1={innerP.x} y1={innerP.y}
                x2={outerP.x} y2={outerP.y}
                stroke="var(--color-high-emphasis)"
                strokeWidth={i % 3 === 0 ? 2.5 : 1}
              />
              {i % 3 === 0 && (
                <text
                  x={labelP.x}
                  y={labelP.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-medium fill-high-emphasis select-none"
                >
                  {hour}
                </text>
              )}
            </g>
          );
        })}

        {/* Minute dots */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i / 60) * 360 - 90;
          const p = polarToCartesian(CX, CY, R - 4, angle);
          return (
            <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={1} fill="var(--color-caption)" />
          );
        })}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={4} fill="var(--color-high-emphasis)" />

        {/* Decorative hands */}
        {selectedTimeSlot && (() => {
          const opt = filteredOptions.find((o) => o.id === selectedTimeSlot);
          if (!opt) return null;
          const midHour = ((opt.hourStart % 12) + (opt.hourEnd % 12 || 12)) / 2;
          const angle = hourToAngle(midHour);
          const hourHand = polarToCartesian(CX, CY, R * 0.5, angle);
          const minuteHand = polarToCartesian(CX, CY, R * 0.7, angle + 30);

          return (
            <>
              <line x1={CX} y1={CY} x2={hourHand.x} y2={hourHand.y} stroke="var(--color-high-emphasis)" strokeWidth="3" strokeLinecap="round" />
              <line x1={CX} y1={CY} x2={minuteHand.x} y2={minuteHand.y} stroke="var(--color-high-emphasis)" strokeWidth="1.5" strokeLinecap="round" />
            </>
          );
        })()}

        {/* Selected time label */}
        {selectedTimeSlot && (() => {
          const opt = filteredOptions.find((o) => o.id === selectedTimeSlot);
          if (!opt) return null;
          return (
            <text x={CX} y={CY + R + 20} textAnchor="middle" className="text-sm font-medium fill-high-emphasis">
              {opt.label}
            </text>
          );
        })()}
      </svg>
    </div>
  );
}
