import client from './client';
import type {
  MovieDetailResponse,
  MusicDetailResponse,
  LightingDetailResponse,
  CoffeeDetailResponse,
} from './types';

// ── 영화 상세 조회 ──
// GET /api/v1/items/{itemId}/movie

export const getMovieDetail = (itemId: number) =>
  client.get<MovieDetailResponse>(`/items/${itemId}/movie`);

// ── 음악 상세 조회 ──
// GET /api/v1/items/{itemId}/music

export const getMusicDetail = (itemId: number) =>
  client.get<MusicDetailResponse>(`/items/${itemId}/music`);

// ── 조명 상세 조회 ──
// GET /api/v1/items/{itemId}/lighting

export const getLightingDetail = (itemId: number) =>
  client.get<LightingDetailResponse>(`/items/${itemId}/lighting`);

// ── 커피 상세 조회 ──
// GET /api/v1/items/{itemId}/coffee

export const getCoffeeDetail = (itemId: number) =>
  client.get<CoffeeDetailResponse>(`/items/${itemId}/coffee`);

// ── 카테고리 키 기반 통합 호출 ──

export type ItemCategory = 'movie' | 'music' | 'lighting' | 'coffee';
export type ItemDetailResponse =
  | MovieDetailResponse
  | MusicDetailResponse
  | LightingDetailResponse
  | CoffeeDetailResponse;

const detailFetchers = {
  movie: getMovieDetail,
  music: getMusicDetail,
  lighting: getLightingDetail,
  coffee: getCoffeeDetail,
};

export const getItemDetail = (itemId: number, category: ItemCategory) =>
  detailFetchers[category](itemId);
