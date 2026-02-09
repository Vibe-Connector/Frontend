import PlaceSelector from './PlaceSelector';
import CompanionSelector from './CompanionSelector';

interface PlaceCompanionPanelProps {
  selectedPlace: string | null;
  selectedCompanion: string | null;
  onPlaceChange: (id: string) => void;
  onCompanionChange: (id: string) => void;
}

export default function PlaceCompanionPanel({
  selectedPlace,
  selectedCompanion,
  onPlaceChange,
  onCompanionChange,
}: PlaceCompanionPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Left: Preview placeholder */}
      <div className="flex items-center justify-center rounded-card bg-surface p-8">
        <div className="text-center">
          <p className="text-4xl">✨</p>
          <p className="mt-3 text-sm text-caption">
            선택을 완료하면
            <br />
            당신만의 Vibe가 생성됩니다
          </p>
        </div>
      </div>

      {/* Right: Selectors */}
      <div className="flex flex-col gap-8">
        <PlaceSelector selectedId={selectedPlace} onChange={onPlaceChange} />
        <CompanionSelector selectedId={selectedCompanion} onChange={onCompanionChange} />
      </div>
    </div>
  );
}
