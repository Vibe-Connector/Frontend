interface SelectionCardProps {
  label: string;
  emoji: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function SelectionCard({
  label,
  emoji,
  description,
  isSelected,
  onClick,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-card p-4 animate-smooth cursor-pointer ${
        isSelected
          ? 'border-2 border-primary bg-primary/5 shadow-card'
          : 'border border-stroke bg-white hover:border-caption'
      }`}
      style={{ transform: isSelected ? 'scale(1.02)' : 'scale(1)' }}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-medium text-high-emphasis">{label}</span>
      <span className="text-xs text-caption">{description}</span>
    </button>
  );
}
