import type { VibeStep } from '../types';

interface StepIndicatorProps {
  currentStep: VibeStep;
}

const STEPS = [1, 2, 3] as const;

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium animate-smooth ${
              step === currentStep
                ? 'bg-brand text-white'
                : step < currentStep
                  ? 'bg-primary text-white'
                  : 'bg-surface text-caption'
            }`}
            aria-current={step === currentStep ? 'step' : undefined}
          >
            {step < currentStep ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              step
            )}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-[2px] w-8 rounded-full animate-smooth ${
                step < currentStep ? 'bg-primary' : 'bg-surface'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
