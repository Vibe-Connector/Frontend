import client from './client';
import type { PageResponse } from './types';

// ── Backend Archive DTOs 매칭 ──

export interface FolderResponse {
  folderId: number;
  folderName: string;
  folderType: string;
  thumbnailUrl: string | null;
  sortOrder: number;
  archiveCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface FolderCreateRequest {
  folderName: string;
  folderType: 'VIBE' | 'ITEM';
  thumbnailUrl?: string;
  sortOrder?: number;
  isPublic?: boolean;
}

export interface FolderUpdateRequest {
  folderName?: string;
  thumbnailUrl?: string;
  sortOrder?: number;
  isPublic?: boolean;
}

export interface ArchiveVibeResponse {
  archiveId: number;
  resultId: number;
  sessionId: number;
  phrase: string | null;
  generatedImageUrl: string | null;
  folderId: number | null;
  folderName: string | null;
  memo: string | null;
  isFavorite: boolean;
  feedId: number | null;
  createdAt: string;
}

export interface ArchiveVibeRequest {
  resultId: number;
  folderId?: number;
  memo?: string;
}

export interface ArchiveItemResponse {
  archiveItemId: number;
  itemId: number;
  itemName: string | null;
  categoryKey: string;
  brand: string | null;
  imageUrl: string | null;
  folderId: number | null;
  folderName: string | null;
  memo: string | null;
  isFavorite: boolean;
  createdAt: string;
}

export interface ArchiveItemRequest {
  itemId: number;
  folderId?: number;
  reactionId?: number;
  memo?: string;
}

// ── 폴더 ──

// GET /api/v1/archives/folders
export const getFolders = (folderType?: string): Promise<FolderResponse[]> =>
  client.get('/archives/folders', { params: { folderType } });

// GET /api/v1/archives/users/{userId}/folders (타인의 공개 폴더 조회)
export const getPublicFolders = (userId: number): Promise<FolderResponse[]> =>
  client.get(`/archives/users/${userId}/folders`);

// POST /api/v1/archives/folders
export const createFolder = (data: FolderCreateRequest): Promise<FolderResponse> =>
  client.post('/archives/folders', data);

// PUT /api/v1/archives/folders/{folderId}
export const updateFolder = (folderId: number, data: FolderUpdateRequest): Promise<FolderResponse> =>
  client.put(`/archives/folders/${folderId}`, data);

// DELETE /api/v1/archives/folders/{folderId}
export const deleteFolder = (folderId: number): Promise<void> =>
  client.delete(`/archives/folders/${folderId}`);

// ── 공개 폴더 컨텐츠 조회 (타인 폴더) ──

// GET /api/v1/archives/users/{userId}/folders/{folderId}/vibes
export const getPublicFolderVibes = (userId: number, folderId: number, cursor?: string, size = 20): Promise<PageResponse<ArchiveVibeResponse>> =>
  client.get(`/archives/users/${userId}/folders/${folderId}/vibes`, { params: { cursor, size } });

// GET /api/v1/archives/users/{userId}/folders/{folderId}/items
export const getPublicFolderItems = (userId: number, folderId: number, cursor?: string, size = 20): Promise<PageResponse<ArchiveItemResponse>> =>
  client.get(`/archives/users/${userId}/folders/${folderId}/items`, { params: { cursor, size } });

// ── Vibe 아카이브 ──

// GET /api/v1/archives/vibes
export const getArchiveVibes = (folderId?: number, cursor?: string, size = 20): Promise<PageResponse<ArchiveVibeResponse>> =>
  client.get('/archives/vibes', { params: { folderId, cursor, size } });

// POST /api/v1/archives/vibes
export const archiveVibe = (data: ArchiveVibeRequest): Promise<ArchiveVibeResponse> =>
  client.post('/archives/vibes', data);

// DELETE /api/v1/archives/vibes/{archiveId}
export const deleteArchiveVibe = (archiveId: number): Promise<void> =>
  client.delete(`/archives/vibes/${archiveId}`);

// POST /api/v1/archives/vibes/{archiveId}/favorite
export const toggleVibeFavorite = (archiveId: number): Promise<{ favorited: boolean }> =>
  client.post(`/archives/vibes/${archiveId}/favorite`);

// ── 아이템 아카이브 ──

// GET /api/v1/archives/items
export const getArchiveItems = (folderId?: number, cursor?: string, size = 20): Promise<PageResponse<ArchiveItemResponse>> =>
  client.get('/archives/items', { params: { folderId, cursor, size } });

// POST /api/v1/archives/items
export const archiveItem = (data: ArchiveItemRequest): Promise<ArchiveItemResponse> =>
  client.post('/archives/items', data);

// DELETE /api/v1/archives/items/{archiveItemId}
export const deleteArchiveItem = (archiveItemId: number): Promise<void> =>
  client.delete(`/archives/items/${archiveItemId}`);

// POST /api/v1/archives/items/{archiveItemId}/favorite
export const toggleItemFavorite = (archiveItemId: number): Promise<{ favorited: boolean }> =>
  client.post(`/archives/items/${archiveItemId}/favorite`);
