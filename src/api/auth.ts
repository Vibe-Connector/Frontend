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

// ── 로그아웃 ──
// POST /api/v1/auth/logout
export const logout = (): Promise<void> =>
  client.post('/auth/logout');
