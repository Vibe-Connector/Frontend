import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StepIndicator from '@/features/vibe/components/StepIndicator';
import StepNavigation from '@/features/vibe/components/StepNavigation';
import MoodMindMap from '@/features/vibe/components/step1/MoodMindMap';
import TimeWeatherPanel from '@/features/vibe/components/step2/TimeWeatherPanel';
import PlaceCompanionPanel from '@/features/vibe/components/step3/PlaceCompanionPanel';
import { useVibeFlow } from '@/features/vibe/hooks/useVibeFlow';
import { useOptions } from '@/hooks/useOptions';
import { createVibe } from '@/api/vibe';

export default function VibeConnector() {
  const flow = useVibeFlow();
  const navigate = useNavigate();
  const { data: options } = useOptions();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // [BEFORE INTEGRATION] navigate('/vibe/loading');
    // [AFTER INTEGRATION] 백엔드 Vibe 생성 API 호출
    if (submitting || !options) return;

    // Frontend string ID → Backend number ID 변환
    const moodKeywordIds = flow.selectedMoods
      .map((moodId) => options.moods.find((m) => m.keywordValue === moodId || String(m.keywordId) === moodId))
      .filter(Boolean)
      .map((m) => m!.keywordId);

    const timeOption = options.times.find((t) => t.timeKey === flow.selectedTimeSlot || String(t.timeId) === flow.selectedTimeSlot);
    const weatherOption = options.weathers.find((w) => w.weatherKey === flow.selectedWeather || String(w.weatherId) === flow.selectedWeather);
    const placeOption = options.places.find((p) => p.placeKey === flow.selectedPlace || String(p.placeId) === flow.selectedPlace);
    const companionOption = options.companions.find((c) => c.companionKey === flow.selectedCompanion || String(c.companionId) === flow.selectedCompanion);

    if (!timeOption || !weatherOption || !placeOption || !companionOption || moodKeywordIds.length === 0) {
      alert('모든 옵션을 선택해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createVibe({
        moodKeywordIds,
        timeId: timeOption.timeId,
        weatherId: weatherOption.weatherId,
        placeId: placeOption.placeId,
        companionId: companionOption.companionId,
      });
      navigate(`/vibe/result/${result.sessionId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Vibe 생성에 실패했습니다.';
      alert(message);
    } finally {
      setSubmitting(false);
    }
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
