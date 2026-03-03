import client from './client';

// ── Backend OptionResponse DTO 매칭 ──

export interface MoodDto {
  keywordId: number;
  keywordValue: string;
  category: string;
  label: string;
}

export interface TimeDto {
  timeId: number;
  timeKey: string;
  timeValue: string;
  period: string;
}

export interface WeatherDto {
  weatherId: number;
  weatherKey: string;
  label: string;
}

export interface PlaceDto {
  placeId: number;
  placeKey: string;
  label: string;
}

export interface CompanionDto {
  companionId: number;
  companionKey: string;
  label: string;
}

export interface OptionResponse {
  moods: MoodDto[];
  times: TimeDto[];
  weathers: WeatherDto[];
  places: PlaceDto[];
  companions: CompanionDto[];
}

// ── 전체 옵션 조회 ──
// GET /api/v1/options
export const getOptions = (lang = 'ko'): Promise<OptionResponse> =>
  client.get('/options', { params: { lang } });

// ── 무드 키워드만 조회 ──
// GET /api/v1/options/moods
export const getMoods = (lang = 'ko', category?: string): Promise<MoodDto[]> =>
  client.get('/options/moods', { params: { lang, category } });
