import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StepIndicator from '@/features/vibe/components/StepIndicator';
import StepNavigation from '@/features/vibe/components/StepNavigation';
import MoodMindMap from '@/features/vibe/components/step1/MoodMindMap';
import TimeWeatherPanel from '@/features/vibe/components/step2/TimeWeatherPanel';
import PlaceCompanionPanel from '@/features/vibe/components/step3/PlaceCompanionPanel';
import { useVibeFlow } from '@/features/vibe/hooks/useVibeFlow';
import { MAX_MOOD_SELECTIONS, EMOTION_ZONES, MOOD_ZONE_MAP } from '@/features/vibe/constants';
import type { MoodKeyword } from '@/features/vibe/types';
import { useOptions } from '@/hooks/useOptions';
import { createVibe } from '@/api/vibe';


// 한국어 폴백 맵 (번역 데이터가 없을 때 사용)
const MOOD_KOREAN_MAP: Record<string, string> = {
  cozy: '포근한', dreamy: '몽글몽글한', languid: '나른한', crisp: '청량한',
  melancholic: '쓸쓸한', energetic: '활기찬', serene: '고요한', nostalgic: '향수 어린',
  focused: '몰입되는', whimsical: '발랄한', romantic: '로맨틱한', mysterious: '신비로운',
  warm: '따뜻한', refreshing: '상쾌한', contemplative: '사색적인',
};

// Backend place_key → 이모지 매핑
const PLACE_EMOJI_MAP: Record<string, string> = {
  home: '🏠', cafe: '☕', office: '💼', park: '🌳', beach: '🏖️',
  mountain: '⛰️', library: '📚', restaurant: '🍽️', bar: '🍷', studio: '🎨',
  bedroom: '🛏️', rooftop: '🌇', car: '🚗', train: '🚆', bookstore: '📖',
  outdoor: '🌳', transit: '🚶',
};

// Backend companion_key → 이모지 매핑
const COMPANION_EMOJI_MAP: Record<string, string> = {
  alone: '🧘', partner: '💑', friends: '👫', family: '👨‍👩‍👧', pet: '🐾',
  colleagues: '🤝', child: '👶', parents: '👨‍👩‍👦', sibling: '👫', best_friend: '🤙',
  stranger: '🤷', mentor: '🎓', group: '👥', date: '💕', classmates: '🏫',
  friend: '👫', lover: '💑', colleague: '🤝',
};

export default function VibeConnector() {
  const flow = useVibeFlow();
  const navigate = useNavigate();
  const { data: options } = useOptions();
  const [submitting, setSubmitting] = useState(false);

  // API 무드를 MoodKeyword 형태로 변환 (감정 영역 기반 색상 할당)
  const apiMoods: MoodKeyword[] | undefined = useMemo(() => {
    if (!options?.moods) return undefined;
    return options.moods.map((m) => {
      const zone = MOOD_ZONE_MAP[m.keywordValue] ?? 'calm';
      return {
        id: m.keywordValue,
        label: m.label === m.keywordValue
          ? (MOOD_KOREAN_MAP[m.keywordValue] ?? m.label)
          : m.label,
        color: EMOTION_ZONES[zone].chipColor,
        zone,
      };
    });
  }, [options]);

  // API 장소/동반자를 UI 형태로 변환
  const apiPlaces = useMemo(() => {
    if (!options?.places) return undefined;
    return options.places.map((p) => ({
      id: p.placeKey,
      label: p.label,
      emoji: PLACE_EMOJI_MAP[p.placeKey] ?? '📍',
      description: p.label,
    }));
  }, [options]);

  const apiCompanions = useMemo(() => {
    if (!options?.companions) return undefined;
    return options.companions.map((c) => ({
      id: c.companionKey,
      label: c.label,
      emoji: COMPANION_EMOJI_MAP[c.companionKey] ?? '👤',
      description: c.label,
    }));
  }, [options]);

  const handleSubmit = async () => {
    if (submitting || !options) return;

    // Frontend string ID → Backend number ID 변환
    const moodKeywordIds = flow.selectedMoods
      .map((moodId) => options.moods.find((m) => m.keywordValue === moodId || String(m.keywordId) === moodId))
      .filter(Boolean)
      .map((m) => m!.keywordId);

    // hour + amPm → 24시간제 변환 → timeId 결정
    let timeId: number | undefined;
    let hour24: number | undefined;
    if (flow.selectedHour !== null) {
      const h = flow.selectedHour;
      if (flow.selectedAmPm === 'AM') {
        hour24 = h === 12 ? 0 : h;
      } else {
        hour24 = h === 12 ? 12 : h + 12;
      }
      // hour24 기반으로 시간대(timeId) 결정
      const matchedTime = options.times.find((t) => {
        const key = t.timeKey;
        if (key === 'dawn') return hour24! >= 0 && hour24! < 6;
        if (key === 'morning') return hour24! >= 6 && hour24! < 12;
        if (key === 'afternoon') return hour24! >= 12 && hour24! < 18;
        if (key === 'evening') return hour24! >= 18 && hour24! < 21;
        if (key === 'night') return hour24! >= 21 && hour24! < 24;
        return false;
      });
      timeId = matchedTime?.timeId;
    }

    // weatherIntensities → weatherId (가장 높은 intensity) + weatherIntensities DTO
    const activeWeathers = Object.entries(flow.weatherIntensities)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a);

    let weatherId: number | undefined;
    if (activeWeathers.length > 0) {
      const topWeatherKey = activeWeathers[0][0];
      const matchedWeather = options.weathers.find((w) => w.weatherKey === topWeatherKey);
      weatherId = matchedWeather?.weatherId;
    }

    const weatherIntensitiesDto = activeWeathers.map(([key, intensity]) => {
      const w = options.weathers.find((wo) => wo.weatherKey === key);
      return w ? { weatherId: w.weatherId, intensity } : null;
    }).filter(Boolean) as { weatherId: number; intensity: number }[];

    const placeOption = options.places.find((p) => p.placeKey === flow.selectedPlace || String(p.placeId) === flow.selectedPlace);
    const companionOption = options.companions.find((c) => c.companionKey === flow.selectedCompanion || String(c.companionId) === flow.selectedCompanion);

    if (!timeId || !weatherId || !placeOption || !companionOption || moodKeywordIds.length === 0) {
      alert('모든 옵션을 선택해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createVibe({
        moodKeywordIds,
        timeId,
        weatherId,
        placeId: placeOption.placeId,
        companionId: companionOption.companionId,
        hour: hour24,
        minute: flow.selectedMinute,
        weatherIntensities: weatherIntensitiesDto,
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
            moods={apiMoods}
            isLimitReached={flow.selectedMoods.length >= MAX_MOOD_SELECTIONS}
          />
        )}

        {flow.currentStep === 2 && (
          <TimeWeatherPanel
            amPm={flow.selectedAmPm}
            selectedHour={flow.selectedHour}
            selectedMinute={flow.selectedMinute}
            weatherIntensities={flow.weatherIntensities}
            onAmPmChange={flow.setAmPm}
            onHourChange={flow.setHour}
            onMinuteChange={flow.setMinute}
            onWeatherIntensityChange={flow.setWeatherIntensity}
          />
        )}

        {flow.currentStep === 3 && (
          <PlaceCompanionPanel
            selectedPlace={flow.selectedPlace}
            selectedCompanion={flow.selectedCompanion}
            onPlaceChange={flow.setPlace}
            onCompanionChange={flow.setCompanion}
            places={apiPlaces}
            companions={apiCompanions}
            submitting={submitting}
          />
        )}
      </div>

      <StepNavigation
        currentStep={flow.currentStep}
        canProceed={flow.canProceed}
        submitting={submitting}
        onPrev={flow.prevStep}
        onNext={flow.nextStep}
        onReset={flow.resetCurrentStep}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
