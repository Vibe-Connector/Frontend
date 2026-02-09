import { PLACE_OPTIONS } from '../../constants';
import SelectionCard from './SelectionCard';

interface PlaceSelectorProps {
  selectedId: string | null;
  onChange: (id: string) => void;
}

export default function PlaceSelector({ selectedId, onChange }: PlaceSelectorProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-high-emphasis">어디에 있나요?</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PLACE_OPTIONS.map((place) => (
          <SelectionCard
            key={place.id}
            label={place.label}
            emoji={place.emoji}
            description={place.description}
            isSelected={selectedId === place.id}
            onClick={() => onChange(place.id)}
          />
        ))}
      </div>
    </div>
  );
}
