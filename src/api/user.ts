import client from './client';

// ── Backend User DTOs 매칭 ──

export interface UserProfileResponse {
  userId: number;
  email: string;
  name: string | null;
  nickname: string;
  gender: string | null;
  birthYear: number | null;
  profileImageUrl: string | null;
  preferredLanguageId: number | null;
  country: string | null;
  timezone: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface PublicUserProfileResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface UpdateProfileRequest {
  nickname?: string;
  name?: string;
  gender?: string;
  birthYear?: number;
  profileImageUrl?: string;
  preferredLanguageId?: number;
  country?: string;
  timezone?: string;
}

export interface UserSettingsResponse {
  pushEnabled: boolean;
  emailNotification: boolean;
  defaultSharePrivacy: string;
}

export interface UpdateSettingsRequest {
  pushEnabled?: boolean;
  emailNotification?: boolean;
  defaultSharePrivacy?: string;
}

export interface SocialAccountResponse {
  socialId: number;
  provider: string;
  linkedAt: string;
}

export interface ProfileImageResponse {
  profileImageUrl: string;
}

// ── 프로필 ──

// GET /api/v1/users/me
export const getMyProfile = (): Promise<UserProfileResponse> =>
  client.get('/users/me');

// GET /api/v1/users/{userId}
export const getPublicProfile = (userId: number): Promise<PublicUserProfileResponse> =>
  client.get(`/users/${userId}`);

// PUT /api/v1/users/me
export const updateProfile = (data: UpdateProfileRequest): Promise<UserProfileResponse> =>
  client.put('/users/me', data);

// PUT /api/v1/users/me/nickname
export const changeNickname = (nickname: string): Promise<UserProfileResponse> =>
  client.put('/users/me/nickname', { nickname });

// PUT /api/v1/users/me/password
export const changePassword = (currentPassword: string, newPassword: string): Promise<void> =>
  client.put('/users/me/password', { currentPassword, newPassword });

// DELETE /api/v1/users/me
export const deleteAccount = (): Promise<void> =>
  client.delete('/users/me');

// ── 프로필 이미지 ──

// POST /api/v1/users/me/profile-image
export const uploadProfileImage = (file: File): Promise<ProfileImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  return client.post('/users/me/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── 설정 ──

// GET /api/v1/users/me/settings
export const getSettings = (): Promise<UserSettingsResponse> =>
  client.get('/users/me/settings');

// PUT /api/v1/users/me/settings
export const updateSettings = (data: UpdateSettingsRequest): Promise<UserSettingsResponse> =>
  client.put('/users/me/settings', data);

// ── 소셜 계정 ──

// GET /api/v1/users/me/social
export const getSocialAccounts = (): Promise<SocialAccountResponse[]> =>
  client.get('/users/me/social');

// POST /api/v1/users/me/social/{provider}
export const linkSocialAccount = (
  provider: string,
  data: { authorizationCode: string; redirectUri: string },
): Promise<SocialAccountResponse> =>
  client.post(`/users/me/social/${provider}`, data);

// DELETE /api/v1/users/me/social/{provider}
export const unlinkSocialAccount = (provider: string): Promise<void> =>
  client.delete(`/users/me/social/${provider}`);
