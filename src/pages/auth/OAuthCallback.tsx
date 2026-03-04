import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { socialLogin } from '@/api/auth';
import { linkSocialAccount } from '@/api/user';
import { useAuthStore } from '@/store/authStore';
import { parseModeFromState } from '@/utils/oauth';

export default function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authLogin = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  const mode = parseModeFromState(searchParams.get('state'));

  useEffect(() => {
    if (processed.current) return;

    const code = searchParams.get('code');

    if (!provider || !code) {
      setError('잘못된 인증 요청입니다.');
      return;
    }

    processed.current = true;

    const redirectUri = `${window.location.origin}/auth/callback/${provider}`;
    const payload = { authorizationCode: code, redirectUri };

    if (mode === 'link' && isAuthenticated) {
      linkSocialAccount(provider, payload)
        .then(() => {
          navigate('/profile/settings', { replace: true });
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : '소셜 계정 연동에 실패했습니다.';
          setError(message);
        });
    } else {
      socialLogin(provider, payload)
        .then((data) => {
          if (data.isNewUser && data.socialSignupToken) {
            // 신규 유저: 회원가입 페이지로 리다이렉트
            sessionStorage.setItem('socialSignup', JSON.stringify({
              socialSignupToken: data.socialSignupToken,
              email: data.email || '',
              profileImageUrl: data.profileImageUrl || '',
            }));
            navigate('/signup', { replace: true });
          } else if (data.accessToken) {
            // 기존 유저: 로그인 처리
            authLogin({
              userId: data.userId!,
              email: data.email!,
              nickname: data.nickname!,
              profileImageUrl: data.profileImageUrl,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken!,
            });
            navigate('/explore', { replace: true });
          }
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : '소셜 로그인에 실패했습니다.';
          setError(message);
        });
    }
  }, [provider, searchParams, authLogin, navigate, mode, isAuthenticated]);

  if (error) {
    const backTo = mode === 'link' ? '/profile/settings' : '/login';
    const backLabel = mode === 'link' ? '설정 페이지로 돌아가기' : '로그인 페이지로 돌아가기';

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-[380px] rounded-card border border-stroke bg-white px-10 py-10 text-center">
          <p className="text-lg font-medium text-high-emphasis">
            {mode === 'link' ? '연동 실패' : '로그인 실패'}
          </p>
          <p className="mt-2 text-sm text-caption">{error}</p>
          <Link
            to={backTo}
            className="mt-6 inline-block rounded-control bg-brand px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-brand" />
        <p className="mt-4 text-sm text-caption">
          {mode === 'link' ? '소셜 계정 연동 중...' : '로그인 처리 중...'}
        </p>
      </div>
    </div>
  );
}
