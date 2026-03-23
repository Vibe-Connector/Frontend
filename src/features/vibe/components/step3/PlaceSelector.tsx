import { useTranslation } from 'react-i18next';
import { PLACE_OPTIONS } from '../../constants';
import SelectionCard from './SelectionCard';

interface PlaceOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

interface PlaceSelectorProps {
  selectedId: string | null;
  onChange: (id: string) => void;
  places?: PlaceOption[];
}

export default function PlaceSelector({ selectedId, onChange, places }: PlaceSelectorProps) {
  const { t } = useTranslation();
  const items = places ?? PLACE_OPTIONS;

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-high-emphasis">{t('vibe.placeQuestion')}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((place) => (
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
