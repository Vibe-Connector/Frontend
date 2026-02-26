// ── 백엔드 ApiResponse<T>와 1:1 매칭 ──
// 근거: Backend/src/.../global/common/ApiResponse.java
// record ApiResponse<T>(boolean success, T data, String code, String message)
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  code: string | null;
  message: string | null;
}

// ── 커서 기반 페이지네이션 ──
// 근거: Backend/src/.../global/common/PageResponse.java
export interface PageResponse<T> {
  content: T[];
  nextCursor: string | null;
  size: number;
  hasNext: boolean;
}

// ── API 에러 클래스 ──
// 인터셉터에서 생성하여 throw, TanStack Query와 ErrorBoundary에서 catch
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// ── 백엔드 ErrorCode 도메인 프리픽스 ──
export type ErrorDomain =
  | 'COM'
  | 'AUTH'
  | 'USER'
  | 'VIBE'
  | 'ITEM'
  | 'FEED'
  | 'FILE'
  | 'FOLLOW'
  | 'LANG'
  | 'ARCHIVE'
  | 'NOTI';
