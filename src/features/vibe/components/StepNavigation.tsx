import type { VibeStep } from '../types';

interface StepNavigationProps {
  currentStep: VibeStep;
  canProceed: boolean;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSubmit: () => void;
}

export default function StepNavigation({
  currentStep,
  canProceed,
  onPrev,
  onNext,
  onReset,
  onSubmit,
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center justify-center rounded-pill px-6 py-3 text-[16px] font-medium tracking-[-1px] bg-disabled text-high-emphasis hover:opacity-80 active:opacity-70 cursor-pointer animate-smooth"
          >
            PREV
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-pill px-6 py-3 text-[16px] font-medium tracking-[-1px] bg-disabled text-high-emphasis hover:opacity-80 active:opacity-70 cursor-pointer animate-smooth"
        >
          RESET
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="inline-flex items-center justify-center rounded-pill px-6 py-3 text-[16px] font-medium tracking-[-1px] bg-disabled text-high-emphasis hover:opacity-80 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer animate-smooth"
          >
            NEXT
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canProceed}
            className="inline-flex items-center justify-center rounded-pill px-6 py-3 text-[16px] font-medium tracking-[-1px] bg-disabled text-high-emphasis hover:opacity-80 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer animate-smooth"
          >
            SUBMIT
          </button>
        )}
      </div>
    </div>
  );
}
