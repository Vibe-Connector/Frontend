const REDIRECT_BASE = `${window.location.origin}/auth/callback`;

export type OAuthMode = 'login' | 'link';

export function getGoogleOAuthUrl(mode: OAuthMode = 'login'): string {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: `${REDIRECT_BASE}/google`,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: mode,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function getNaverOAuthUrl(mode: OAuthMode = 'login'): string {
  const state = `${mode}_${crypto.randomUUID()}`;
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_NAVER_CLIENT_ID,
    redirect_uri: `${REDIRECT_BASE}/naver`,
    response_type: 'code',
    state,
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params}`;
}

/** 콜백에서 state 파라미터로부터 mode 추출 */
export function parseModeFromState(state: string | null): OAuthMode {
  if (!state) return 'login';
  if (state === 'link' || state.startsWith('link_')) return 'link';
  return 'login';
}
