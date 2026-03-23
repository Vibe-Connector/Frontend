import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlaceSelector from './PlaceSelector';
import CompanionSelector from './CompanionSelector';
import { getSceneImageUrl } from '../../utils/sceneImage';
import GeckoLoader from '@/components/feedback/GeckoLoader';

interface PlaceOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

interface CompanionOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

interface PlaceCompanionPanelProps {
  selectedPlace: string | null;
  selectedCompanion: string | null;
  onPlaceChange: (id: string) => void;
  onCompanionChange: (id: string) => void;
  places?: PlaceOption[];
  companions?: CompanionOption[];
  submitting?: boolean;
}

export default function PlaceCompanionPanel({
  selectedPlace,
  selectedCompanion,
  onPlaceChange,
  onCompanionChange,
  places,
  companions,
  submitting = false,
}: PlaceCompanionPanelProps) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const showImage = selectedPlace && selectedCompanion && !imgError;

  // Reset error when selection changes
  const handlePlaceChange = (id: string) => {
    setImgError(false);
    onPlaceChange(id);
  };
  const handleCompanionChange = (id: string) => {
    setImgError(false);
    onCompanionChange(id);
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Left: Scene preview */}
      <div className="flex items-center justify-center overflow-hidden rounded-card bg-surface">
        {submitting ? (
          <div className="aspect-[8/11] w-full">
            <GeckoLoader inline />
          </div>
        ) : showImage ? (
          <img
            key={`${selectedPlace}_${selectedCompanion}`}
            src={getSceneImageUrl(selectedPlace, selectedCompanion)}
            alt={t('vibe.sceneAlt')}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-4xl">✨</p>
            <p className="mt-3 text-sm text-caption whitespace-pre-line">
              {t('vibe.sceneEmpty')}
            </p>
          </div>
        )}
      </div>

      {/* Right: Selectors */}
      <div className="flex flex-col gap-8">
        <PlaceSelector selectedId={selectedPlace} onChange={handlePlaceChange} places={places} />
        <CompanionSelector selectedId={selectedCompanion} onChange={handleCompanionChange} companions={companions} />
      </div>
    </div>
  );
}
