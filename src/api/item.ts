import client from './client';
import type { MovieDetailResponse, MusicDetailResponse } from './types';

// ── 영화 상세 조회 ──
// GET /api/v1/items/{itemId}/movie

export const getMovieDetail = (itemId: number) =>
  client.get<MovieDetailResponse>(`/items/${itemId}/movie`);

// ── 음악 상세 조회 ──
// GET /api/v1/items/{itemId}/music

export const getMusicDetail = (itemId: number) =>
  client.get<MusicDetailResponse>(`/items/${itemId}/music`);
