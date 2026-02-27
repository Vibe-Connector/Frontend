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

// ══════════════════════════════════════════════════════════════
// 피드 도메인
// 근거: Backend domain/feed/dto/*.java
// ══════════════════════════════════════════════════════════════

export type ReactionType = 'LIKE' | 'LOVE' | 'WOW' | 'COZY';

export interface ReactionSummary {
  reactionType: string;
  count: number;
}

export interface FeedResponse {
  feedId: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  resultId: number;
  generatedImageUrl: string | null;
  phrase: string | null;
  caption: string | null;
  isPublic: boolean;
  viewCount: number;
  reactions: ReactionSummary[];
  commentCount: number;
  myReactionTypes: string[]; // 비인증 시 빈 배열
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface FeedCreateRequest {
  resultId: number;
  caption?: string | null;
  isPublic?: boolean | null;
}

export interface FeedUpdateRequest {
  caption?: string | null;
  isPublic?: boolean | null;
}

// ══════════════════════════════════════════════════════════════
// 댓글 도메인
// 근거: Backend domain/feed/dto/Comment*.java
// ══════════════════════════════════════════════════════════════

export interface CommentResponse {
  commentId: number;
  feedId: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  parentCommentId: number | null;
  content: string;
  likeCount: number;
  isLikedByMe: boolean;
  replies: CommentResponse[]; // 재귀 (대댓글)
  createdAt: string;
}

export interface CommentCreateRequest {
  content: string;
  parentCommentId?: number | null;
}

export interface CommentUpdateRequest {
  content: string;
}

// ══════════════════════════════════════════════════════════════
// 아이템 도메인
// 근거: Backend domain/item/dto/*.java
// ══════════════════════════════════════════════════════════════

// 4개 도메인(영화/음악/조명/커피) 공통 필드
export interface ItemCommon {
  itemId: number;
  itemName: string | null; // 번역 없으면 null
  description: string | null;
  categoryKey: string;
  categoryName: string | null;
  brand: string | null;
  imageUrl: string | null;
  externalLink: string | null;
  externalService: string | null;
}

// ── 영화 ──

export interface CastInfo {
  name: string;
  role: string;
}

export interface MovieDetailResponse extends ItemCommon {
  tmdbId: number;
  originalTitle: string | null;
  overview: string | null;
  releaseDate: string | null; // "2019-05-30"
  runtime: number | null;
  voteAverage: number | null;
  voteCount: number | null;
  posterPath: string | null;
  genres: string[];
  castInfo: CastInfo[];
  contentType: string; // "MOVIE" | "TV"
}

// ── 음악 ──

export interface ArtistInfo {
  name: string;
  role: string;
}

export interface MusicDetailResponse extends ItemCommon {
  artists: ArtistInfo[];
  albumName: string | null;
  albumCoverUrl: string | null;
  trackDurationMs: number | null;
  releaseDate: string | null;
  genres: string[];
  previewUrl: string | null;
  spotifyUri: string | null;
  contentType: string; // "TRACK" | "ALBUM" | "PLAYLIST"
}

// ── 조명 ──

export interface LightingDetailResponse extends ItemCommon {
  colorTempKelvin: number | null;
  colorTempName: string | null;
  brightnessPercent: number | null;
  brightnessLevel: string | null;
  lightingType: string | null;
  lightColor: string | null;
  position: string | null;
  spaceContext: string | null;
  timeContext: string | null;
  isDynamic: boolean;
}

// ── 커피 ──

export interface CupSize {
  type: string;
  ml: number;
}

export interface AromaProfile {
  primary: string[];
}

export interface CoffeeDetailResponse extends ItemCommon {
  capsuleName: string | null;
  line: string | null; // "ORIGINAL" | "VERTUO"
  subCategory: string | null;
  intensity: number | null;
  intensityMax: number | null;
  cupSizes: CupSize[];
  beanType: string | null;
  origins: string[];
  roastLevel: string | null;
  aromaProfile: AromaProfile | null;
  flavorNotes: string | null;
  body: number | null;
  bitterness: number | null;
  acidity: number | null;
  roasting: number | null;
  isDecaf: boolean;
  isLimitedEdition: boolean;
  pricePerCapsuleKrw: number | null;
}
