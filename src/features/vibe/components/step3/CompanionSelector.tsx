import { COMPANION_OPTIONS } from '../../constants';
import SelectionCard from './SelectionCard';

interface CompanionSelectorProps {
  selectedId: string | null;
  onChange: (id: string) => void;
}

export default function CompanionSelector({ selectedId, onChange }: CompanionSelectorProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-high-emphasis">누구와 함께인가요?</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {COMPANION_OPTIONS.map((companion) => (
          <SelectionCard
            key={companion.id}
            label={companion.label}
            emoji={companion.emoji}
            description={companion.description}
            isSelected={selectedId === companion.id}
            onClick={() => onChange(companion.id)}
          />
        ))}
      </div>
    </div>
  );
}
