import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StepIndicator from '@/features/vibe/components/StepIndicator';
import StepNavigation from '@/features/vibe/components/StepNavigation';
import MoodMindMap from '@/features/vibe/components/step1/MoodMindMap';
import TimeWeatherPanel from '@/features/vibe/components/step2/TimeWeatherPanel';
import PlaceCompanionPanel from '@/features/vibe/components/step3/PlaceCompanionPanel';
import { useVibeFlow } from '@/features/vibe/hooks/useVibeFlow';

export default function VibeConnector() {
  const flow = useVibeFlow();
  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: API 연동 — 세션 ID를 서버에서 받아와 전달
    navigate('/vibe/loading');
  };

  return (
    <PageContainer>
      <StepIndicator currentStep={flow.currentStep} />

      <div
        key={flow.currentStep}
        className={flow.direction === 'forward' ? 'animate-slide-right' : 'animate-slide-left'}
      >
        {flow.currentStep === 1 && (
          <MoodMindMap
            selectedMoods={flow.selectedMoods}
            customMoods={flow.customMoods}
            onToggleMood={flow.toggleMood}
            onAddCustomMood={flow.addCustomMood}
            onRemoveCustomMood={flow.removeCustomMood}
          />
        )}

        {flow.currentStep === 2 && (
          <TimeWeatherPanel
            amPm={flow.selectedAmPm}
            selectedTimeSlot={flow.selectedTimeSlot}
            selectedWeather={flow.selectedWeather}
            onAmPmChange={flow.setAmPm}
            onTimeSlotChange={flow.setTimeSlot}
            onWeatherChange={flow.setWeather}
          />
        )}

        {flow.currentStep === 3 && (
          <PlaceCompanionPanel
            selectedPlace={flow.selectedPlace}
            selectedCompanion={flow.selectedCompanion}
            onPlaceChange={flow.setPlace}
            onCompanionChange={flow.setCompanion}
          />
        )}
      </div>

      <StepNavigation
        currentStep={flow.currentStep}
        canProceed={flow.canProceed}
        onPrev={flow.prevStep}
        onNext={flow.nextStep}
        onReset={flow.resetCurrentStep}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
