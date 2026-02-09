import type { MoodKeyword, TimeOption, WeatherOption, PlaceOption, CompanionOption } from './types';

export const MOOD_KEYWORDS: MoodKeyword[] = [
  { id: 'cozy', label: '포근한', color: '#FFD6E0' },
  { id: 'dreamy', label: '몽환적인', color: '#D9D4FF' },
  { id: 'refreshing', label: '상쾌한', color: '#C8F7DC' },
  { id: 'calm', label: '잔잔한', color: '#C8E6FF' },
  { id: 'warm', label: '따뜻한', color: '#FFF0C8' },
  { id: 'energetic', label: '에너지 넘치는', color: '#FFD4C4' },
];

export const TIME_OPTIONS: TimeOption[] = [
  { id: 'dawn', label: '새벽', hourStart: 0, hourEnd: 6 },
  { id: 'morning', label: '아침', hourStart: 6, hourEnd: 12 },
  { id: 'afternoon', label: '낮', hourStart: 12, hourEnd: 18 },
  { id: 'evening', label: '저녁', hourStart: 18, hourEnd: 21 },
  { id: 'night', label: '밤', hourStart: 21, hourEnd: 24 },
];

export const WEATHER_OPTIONS: WeatherOption[] = [
  { id: 'sunny', label: '맑음', icon: 'sun' },
  { id: 'cloudy', label: '흐림', icon: 'cloud' },
  { id: 'rainy', label: '비', icon: 'rain' },
  { id: 'snowy', label: '눈', icon: 'snow' },
];

export const PLACE_OPTIONS: PlaceOption[] = [
  { id: 'home', label: '집', emoji: '🏠', description: '편안한 나만의 공간' },
  { id: 'cafe', label: '카페', emoji: '☕', description: '향긋한 커피와 함께' },
  { id: 'office', label: '사무실', emoji: '💼', description: '집중할 수 있는 곳' },
  { id: 'outdoor', label: '야외', emoji: '🌳', description: '자연과 함께' },
  { id: 'transit', label: '이동 중', emoji: '🚶', description: '어딘가로 향하는 길' },
];

export const COMPANION_OPTIONS: CompanionOption[] = [
  { id: 'alone', label: '혼자', emoji: '🧘', description: '나만의 시간' },
  { id: 'friend', label: '친구', emoji: '👫', description: '편한 사이' },
  { id: 'lover', label: '연인', emoji: '💑', description: '특별한 사람과' },
  { id: 'family', label: '가족', emoji: '👨‍👩‍👧', description: '따뜻한 시간' },
  { id: 'colleague', label: '동료', emoji: '🤝', description: '함께 일하는 사이' },
];

export const MAX_MOOD_SELECTIONS = 5;
export const MAX_CUSTOM_MOODS = 3;
