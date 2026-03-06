import type { MoodKeyword, EmotionZone, TimeOption, WeatherOption, PlaceOption, CompanionOption } from './types';

/* ── Emotion Zone 설정 ── */

export const EMOTION_ZONES: Record<EmotionZone, { label: string; chipColor: string }> = {
  warm:       { label: '따뜻함', chipColor: '#F1863B' },
  energy:     { label: '활력',   chipColor: '#F4B225' },
  calm:       { label: '고요함', chipColor: '#0090F9' },
  melancholy: { label: '그리움', chipColor: '#82898E' },
  dream:      { label: '몽환',   chipColor: '#7572FF' },
};

export const MOOD_ZONE_MAP: Record<string, EmotionZone> = {
  cozy: 'warm',          warm: 'warm',
  energetic: 'energy',   whimsical: 'energy',   refreshing: 'energy',  crisp: 'energy',
  serene: 'calm',        contemplative: 'calm', focused: 'calm',
  melancholic: 'melancholy', nostalgic: 'melancholy', languid: 'melancholy',
  dreamy: 'dream',       romantic: 'dream',     mysterious: 'dream',
};

export const MOOD_KEYWORDS: MoodKeyword[] = [
  { id: 'cozy',          label: '포근한',     color: '#F1863B', zone: 'warm' },
  { id: 'warm',          label: '따뜻한',     color: '#F1863B', zone: 'warm' },
  { id: 'energetic',     label: '활기찬',     color: '#F4B225', zone: 'energy' },
  { id: 'whimsical',     label: '발랄한',     color: '#F4B225', zone: 'energy' },
  { id: 'refreshing',    label: '상쾌한',     color: '#F4B225', zone: 'energy' },
  { id: 'crisp',         label: '청량한',     color: '#F4B225', zone: 'energy' },
  { id: 'serene',        label: '고요한',     color: '#0090F9', zone: 'calm' },
  { id: 'contemplative', label: '사색적인',   color: '#0090F9', zone: 'calm' },
  { id: 'focused',       label: '몰입되는',   color: '#0090F9', zone: 'calm' },
  { id: 'melancholic',   label: '쓸쓸한',     color: '#82898E', zone: 'melancholy' },
  { id: 'nostalgic',     label: '향수 어린',  color: '#82898E', zone: 'melancholy' },
  { id: 'languid',       label: '나른한',     color: '#82898E', zone: 'melancholy' },
  { id: 'dreamy',        label: '몽글몽글한', color: '#7572FF', zone: 'dream' },
  { id: 'romantic',      label: '로맨틱한',   color: '#7572FF', zone: 'dream' },
  { id: 'mysterious',    label: '신비로운',   color: '#7572FF', zone: 'dream' },
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
