import { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface AnalogClockProps {
  amPm: 'AM' | 'PM';
  selectedHour: number | null;
  selectedMinute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
}

const CX = 150;
const CY = 150;
const R = 120;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function hourToAngle(hour: number): number {
  return ((hour % 12) / 12) * 360 - 90;
}

function minuteToAngle(minute: number): number {
  return (minute / 60) * 360 - 90;
}

function snapToFiveMinutes(minute: number): number {
  return Math.round(minute / 5) * 5 % 60;
}

function formatTime(hour: number | null, minute: number, amPm: 'AM' | 'PM'): string {
  if (hour === null) return '--:-- ' + amPm;
  const displayHour = hour === 0 ? 12 : hour;
  const displayMinute = String(minute).padStart(2, '0');
  return `${displayHour}:${displayMinute} ${amPm}`;
}

export default function AnalogClock({
  amPm,
  selectedHour,
  selectedMinute,
  onHourChange,
  onMinuteChange,
}: AnalogClockProps) {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  const getAngleFromEvent = useCallback((e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    const x = (e.clientX - rect.left) * scaleX - CX;
    const y = (e.clientY - rect.top) * scaleY - CY;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  }, []);

  const handleMinuteDrag = useCallback((e: MouseEvent) => {
    if (!draggingRef.current || selectedHour === null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    const x = (e.clientX - rect.left) * scaleX - CX;
    const y = (e.clientY - rect.top) * scaleY - CY;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    const rawMinute = (angle / 360) * 60;
    onMinuteChange(snapToFiveMinutes(rawMinute));
  }, [selectedHour, onMinuteChange]);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMinuteDrag);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMinuteDrag]);

  const handleMinuteMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedHour === null) return;
    e.preventDefault();
    draggingRef.current = true;
    document.addEventListener('mousemove', handleMinuteDrag);
    document.addEventListener('mouseup', handleMouseUp);
  }, [selectedHour, handleMinuteDrag, handleMouseUp]);

  const handleHourClick = (hour: number) => {
    onHourChange(hour);
  };

  // Hour hand position
  const hourAngle = selectedHour !== null
    ? hourToAngle(selectedHour) + (selectedMinute / 60) * 30
    : null;
  const hourHandEnd = hourAngle !== null
    ? polarToCartesian(CX, CY, R * 0.5, hourAngle)
    : null;

  // Minute hand position
  const minAngle = minuteToAngle(selectedMinute);
  const minuteHandEnd = polarToCartesian(CX, CY, R * 0.7, minAngle);

  // Hour highlight color based on time of day
  const getHourColor = (h: number): string => {
    const h24 = amPm === 'PM' && h !== 12 ? h + 12 : amPm === 'AM' && h === 12 ? 0 : h;
    if (h24 < 6) return '#7572FF40'; // dawn
    if (h24 < 12) return '#F4B22540'; // morning
    if (h24 < 18) return '#0090F940'; // afternoon
    if (h24 < 21) return '#F1863B40'; // evening
    return '#82898E40'; // night
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        className="w-full max-w-[300px] select-none"
      >
        {/* Clock face */}
        <circle cx={CX} cy={CY} r={R + 5} fill="white" stroke="var(--color-stroke)" strokeWidth="2" />

        {/* Hour click areas (12 segments) */}
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i === 0 ? 12 : i;
          const isSelected = selectedHour === hour;
          const startAngle = (i / 12) * 360 - 90 - 15;
          const endAngle = startAngle + 30;
          const midAngle = (startAngle + endAngle) / 2;
          const hitStart = polarToCartesian(CX, CY, R - 2, startAngle);
          const hitEnd = polarToCartesian(CX, CY, R - 2, endAngle);
          const largeArc = 0;
          const d = `M ${CX} ${CY} L ${hitStart.x} ${hitStart.y} A ${R - 2} ${R - 2} 0 ${largeArc} 1 ${hitEnd.x} ${hitEnd.y} Z`;

          return (
            <path
              key={`hour-${i}`}
              d={d}
              fill={isSelected ? getHourColor(hour) : 'transparent'}
              stroke="none"
              className="cursor-pointer hover:opacity-70"
              onClick={() => handleHourClick(hour)}
              role="radio"
              aria-checked={isSelected}
              aria-label={t('vibe.hourAria', { hour })}
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
            <g key={i} className="cursor-pointer" onClick={() => handleHourClick(hour)}>
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

        {/* Hour hand */}
        {hourHandEnd && (
          <line
            x1={CX} y1={CY}
            x2={hourHandEnd.x} y2={hourHandEnd.y}
            stroke="var(--color-high-emphasis)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Minute hand (draggable) */}
        {selectedHour !== null && (
          <g
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMinuteMouseDown}
          >
            <line
              x1={CX} y1={CY}
              x2={minuteHandEnd.x} y2={minuteHandEnd.y}
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              pointerEvents="none"
            />
            <circle
              cx={minuteHandEnd.x}
              cy={minuteHandEnd.y}
              r={8}
              fill="var(--color-primary)"
              stroke="white"
              strokeWidth="2"
            />
            {/* Invisible larger hit area for easier dragging */}
            <line
              x1={CX} y1={CY}
              x2={minuteHandEnd.x} y2={minuteHandEnd.y}
              stroke="transparent"
              strokeWidth="20"
            />
          </g>
        )}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={5} fill="var(--color-high-emphasis)" />
      </svg>

      {/* Digital clock display */}
      <div className="rounded-control bg-surface px-6 py-2 text-center">
        <span className="text-lg font-bold tracking-wider text-high-emphasis font-mono">
          {formatTime(selectedHour, selectedMinute, amPm)}
        </span>
      </div>
    </div>
  );
}
