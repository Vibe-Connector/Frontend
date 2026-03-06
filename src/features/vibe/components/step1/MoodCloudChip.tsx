interface MoodCloudChipProps {
  label: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function MoodCloudChip({
  label,
  color,
  isSelected,
  onClick,
  disabled = false,
}: MoodCloudChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={disabled ? undefined : onClick}
      className={`select-none animate-smooth ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
      }`}
      style={{
        transform: isSelected ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      <div
        className="flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-high-emphasis animate-smooth"
        style={{
          backgroundColor: isSelected ? `${color}30` : `${color}15`,
          border: isSelected ? `1.5px solid ${color}80` : '1.5px solid transparent',
          borderRadius: '50% 40% 50% 45% / 45% 50% 40% 50%',
          boxShadow: isSelected ? `0 2px 8px ${color}25` : 'none',
        }}
      >
        {isSelected && (
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {label}
      </div>
    </button>
  );
}
