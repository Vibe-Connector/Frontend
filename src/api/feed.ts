import client from './client';
import type {
  FeedResponse,
  FeedCreateRequest,
  FeedUpdateRequest,
  CommentResponse,
  CommentCreateRequest,
  CommentUpdateRequest,
  ReactionSummary,
  ReactionType,
  ReactionUserResponse,
  PageResponse,
} from './types';

// ── 피드 CRUD ──

// GET /api/v1/feeds
export const getFeeds = (cursor?: string, size = 20): Promise<PageResponse<FeedResponse>> =>
  client.get('/feeds', { params: { cursor, size } });

// GET /api/v1/feeds/{feedId}
export const getFeed = (feedId: number): Promise<FeedResponse> =>
  client.get(`/feeds/${feedId}`);

// POST /api/v1/feeds
export const createFeed = (data: FeedCreateRequest): Promise<FeedResponse> =>
  client.post('/feeds', data);

// PUT /api/v1/feeds/{feedId}
export const updateFeed = (feedId: number, data: FeedUpdateRequest): Promise<FeedResponse> =>
  client.put(`/feeds/${feedId}`, data);

// DELETE /api/v1/feeds/{feedId}
export const deleteFeed = (feedId: number): Promise<void> =>
  client.delete(`/feeds/${feedId}`);

// GET /api/v1/users/{userId}/feeds
export const getUserFeeds = (userId: number, cursor?: string, size = 20): Promise<PageResponse<FeedResponse>> =>
  client.get(`/users/${userId}/feeds`, { params: { cursor, size } });

// ── 리액션 ──

// POST /api/v1/feeds/{feedId}/reactions
export const toggleReaction = (feedId: number, reactionType: ReactionType): Promise<ReactionSummary> =>
  client.post(`/feeds/${feedId}/reactions`, null, { params: { reactionType } });

// GET /api/v1/feeds/{feedId}/reactions/users
export const getReactionUsers = (feedId: number): Promise<ReactionUserResponse[]> =>
  client.get(`/feeds/${feedId}/reactions/users`);

// ── 댓글 ──

// GET /api/v1/feeds/{feedId}/comments
export const getComments = (feedId: number, cursor?: string, size = 20): Promise<PageResponse<CommentResponse>> =>
  client.get(`/feeds/${feedId}/comments`, { params: { cursor, size } });

// POST /api/v1/feeds/{feedId}/comments
export const createComment = (feedId: number, data: CommentCreateRequest): Promise<CommentResponse> =>
  client.post(`/feeds/${feedId}/comments`, data);

// PUT /api/v1/comments/{commentId}
export const updateComment = (commentId: number, data: CommentUpdateRequest): Promise<CommentResponse> =>
  client.put(`/comments/${commentId}`, data);

// DELETE /api/v1/comments/{commentId}
export const deleteComment = (commentId: number): Promise<void> =>
  client.delete(`/comments/${commentId}`);

// POST /api/v1/comments/{commentId}/reactions
export const toggleCommentLike = (commentId: number): Promise<void> =>
  client.post(`/comments/${commentId}/reactions`);
