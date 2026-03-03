import client from './client';
import type { PageResponse } from './types';

// ── Backend Follow DTOs 매칭 ──

export interface FollowResponse {
  following: boolean;
  followerCount: number;
}

export interface FollowUserResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  following: boolean;
}

// ── API 함수 ──

// POST /api/v1/users/{userId}/follow
export const followUser = (userId: number): Promise<FollowResponse> =>
  client.post(`/users/${userId}/follow`);

// DELETE /api/v1/users/{userId}/follow
export const unfollowUser = (userId: number): Promise<FollowResponse> =>
  client.delete(`/users/${userId}/follow`);

// GET /api/v1/users/{userId}/follow/status
export const getFollowStatus = (userId: number): Promise<FollowResponse> =>
  client.get(`/users/${userId}/follow/status`);

// GET /api/v1/users/{userId}/followers
export const getFollowers = (userId: number, cursor?: string, size = 20): Promise<PageResponse<FollowUserResponse>> =>
  client.get(`/users/${userId}/followers`, { params: { cursor, size } });

// GET /api/v1/users/{userId}/following
export const getFollowing = (userId: number, cursor?: string, size = 20): Promise<PageResponse<FollowUserResponse>> =>
  client.get(`/users/${userId}/following`, { params: { cursor, size } });
