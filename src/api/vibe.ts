import client from './client';
import aiClient from './aiClient';

// ── Vibe 생성 요청 ──

export interface VibeCreateRequest {
  moodKeywordIds: number[];
  timeId: number;
  weatherId: number;
  placeId: number;
  companionId: number;
}

// ── 선택 옵션 요약 ──

export interface SelectedOptions {
  moods: string[];
  time: string;
  weather: string;
  place: string;
  companion: string;
}

// ── 추천 아이템 ──

export interface RecommendedItemResponse {
  itemId: number;
  itemKey: string;
  itemName: string;
  categoryKey: string;
  brand: string | null;
  imageUrl: string | null;
  externalLink: string | null;
  externalService: string | null;
  matchScore: number;
  recommendReason: string | null;
}

export interface CategoryRecommendation {
  categoryKey: string;
  items: RecommendedItemResponse[];
}

// ── Vibe 결과 ──

export interface VibeResultResponse {
  sessionId: number;
  resultId: number;
  phrase: string | null;
  analysis: string | null;
  selectedOptions: SelectedOptions;
  recommendations: CategoryRecommendation[];
  processingTimeMs: number | null;
  createdAt: string;
}

// ── 세션 생성 응답 ──

export interface VibeSessionCreateResponse {
  sessionId: number;
  status: string;
  createdAt: string;
}

// ── Vibe 이력 ──

export interface VibeHistoryResponse {
  sessionId: number;
  resultId: number;
  phrase: string | null;
  moods: string[];
  time: string;
  weather: string;
  place: string;
  companion: string;
  createdAt: string;
}

// ── API 함수 ──

// POST /api/v1/vibes — 통합 Vibe 생성 (AI 호출 포함, 시간이 걸림)
export const createVibe = (data: VibeCreateRequest): Promise<VibeResultResponse> =>
  aiClient.post('/vibes', data);

// POST /api/v1/vibes/sessions — 세션만 생성
export const createSession = (): Promise<VibeSessionCreateResponse> =>
  client.post('/vibes/sessions');

// GET /api/v1/vibes/sessions/{sessionId} — 세션 상세 (결과 포함)
export const getVibeSession = (sessionId: number): Promise<VibeResultResponse> =>
  client.get(`/vibes/sessions/${sessionId}`);

// GET /api/v1/vibes/results/{resultId}/items — 추천 아이템
export const getVibeResultItems = (resultId: number): Promise<CategoryRecommendation[]> =>
  client.get(`/vibes/results/${resultId}/items`);

// POST /api/v1/vibes/items/{vibeItemId}/like — 좋아요 토글
export const toggleVibeItemLike = (vibeItemId: number): Promise<{ vibeItemId: number; isLiked: boolean }> =>
  client.post(`/vibes/items/${vibeItemId}/like`);

// GET /api/v1/vibes/history — 생성 이력
export const getVibeHistory = (): Promise<VibeHistoryResponse[]> =>
  client.get('/vibes/history');
