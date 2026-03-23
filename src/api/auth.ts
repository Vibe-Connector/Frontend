import client from './client';
import type { TokenResponse } from '@/store/authStore';

// ── 로그인 ──
// POST /api/v1/auth/login
export interface LoginRequest {
  email: string;
  password: string;
}

export const login = (data: LoginRequest): Promise<TokenResponse> =>
  client.post('/auth/login', data);

// ── 회원가입 ──
// POST /api/v1/auth/signup
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export const signup = (data: SignupRequest): Promise<TokenResponse> =>
  client.post('/auth/signup', data);

// ── 이메일 중복 확인 ──
// GET /api/v1/auth/check-email
export const checkEmail = (email: string): Promise<{ available: boolean }> =>
  client.get('/auth/check-email', { params: { email } });

// ── 닉네임 중복 확인 ──
// GET /api/v1/auth/check-nickname
export const checkNickname = (nickname: string): Promise<{ available: boolean }> =>
  client.get('/auth/check-nickname', { params: { nickname } });

// ── 이메일 인증 코드 발송 ──
// POST /api/v1/auth/send-verification-code
export const sendVerificationCode = (email: string): Promise<void> =>
  client.post('/auth/send-verification-code', { email });

// ── 이메일 인증 코드 검증 ──
// POST /api/v1/auth/verify-code
export const verifyCode = (email: string, code: string): Promise<{ verified: boolean }> =>
  client.post('/auth/verify-code', { email, code });

// ── 로그아웃 ──
// POST /api/v1/auth/logout
export const logout = (): Promise<void> =>
  client.post('/auth/logout');

// ── 소셜 로그인 ──
// POST /api/v1/auth/social/{provider}
export interface SocialLoginRequest {
  authorizationCode: string;
  redirectUri: string;
}

export interface SocialLoginResponse {
  userId: number | null;
  email: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
  preferredLanguageId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  isNewUser: boolean;
  socialSignupToken: string | null;
}

export const socialLogin = (
  provider: string,
  data: SocialLoginRequest,
): Promise<SocialLoginResponse> =>
  client.post(`/auth/social/${provider}`, data);

// ── 소셜 회원가입 ──
// POST /api/v1/auth/social-signup
export interface SocialSignupRequest {
  socialSignupToken: string;
  nickname: string;
  password: string;
}

export const socialSignup = (data: SocialSignupRequest): Promise<TokenResponse> =>
  client.post('/auth/social-signup', data);
