import client from './client';
import type { PageResponse } from './types';

// ── Backend ExploreVibeResponse DTO 매칭 ──

export interface ExploreVibeResponse {
  feedId: number;
  resultId: number;
  generatedImageUrl: string | null;
  caption: string | null;
  authorId: number;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  popularityScore: number;
  createdAt: string;
  isArchived: boolean;
  archiveId: number | null;
}

export type ExplorePeriod = 'DAY' | 'WEEK' | 'MONTH';

// ── 인기 Vibe 조회 ──
// GET /api/v1/explore/vibes
export const getExploreVibes = (
  period: ExplorePeriod = 'WEEK',
  cursor?: string,
  size = 20,
): Promise<PageResponse<ExploreVibeResponse>> =>
  client.get('/explore/vibes', { params: { period, cursor, size } });
