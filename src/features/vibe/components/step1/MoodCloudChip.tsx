interface MoodCloudChipProps {
  label: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  isCustom?: boolean;
  onRemove?: () => void;
}

export default function MoodCloudChip({
  label,
  color,
  isSelected,
  onClick,
  isCustom,
  onRemove,
}: MoodCloudChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={onClick}
      className="group relative animate-smooth cursor-pointer select-none"
      style={{
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div
        className="flex items-center justify-center px-6 py-4 text-sm font-medium text-high-emphasis animate-smooth"
        style={{
          backgroundColor: isSelected ? color : `${color}80`,
          borderRadius: '50% 40% 50% 45% / 45% 50% 40% 50%',
          boxShadow: isSelected ? 'var(--shadow-card)' : 'none',
          minWidth: '100px',
          minHeight: '70px',
        }}
      >
        {label}
      </div>

      {isCustom && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-caption text-white text-xs opacity-0 group-hover:opacity-100 animate-smooth"
          aria-label={`${label} 삭제`}
        >
          x
        </button>
      )}
    </button>
  );
}
