import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput } from '@/components/common';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getGoogleOAuthUrl, getNaverOAuthUrl } from '@/utils/oauth';

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const authLogin = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    // [BEFORE INTEGRATION] 빈 TODO 함수
    // [AFTER INTEGRATION] 백엔드 API 연동
    setError('');
    setLoading(true);
    try {
      const data = await login({ email: id, password });
      authLogin(data);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[calc(100vh-var(--spacing-header)-var(--spacing-footer))] items-center justify-center">
      <div className="w-full max-w-[380px] rounded-card border border-stroke bg-white px-10 pt-10 pb-8">
        {/* Title */}
        <div className="mb-8 flex items-start gap-2">
          <h1 className="text-[28px] leading-tight font-bold tracking-[-1px] text-high-emphasis">
            HOW&rsquo;S YOUR
            <br />
            MOOD
            <br />
            TODAY
          </h1>

          {/* Magnifying glass icon */}
          <svg
            className="mt-1 h-8 w-8 text-caption"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <TextInput
            label="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
          />

          <TextInput
            label="PASSWORD"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {/* Error message */}
          {error && (
            <p className="text-sm text-accent">{error}</p>
          )}

          {/* LOG IN button */}
          <ButtonDefault shape="rect" type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : 'LOG IN'}
          </ButtonDefault>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke" />
          <span className="text-xs text-caption">또는</span>
          <div className="h-px flex-1 bg-stroke" />
        </div>

        {/* Social Login */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-control border border-stroke bg-white px-4 py-3 text-sm font-medium text-high-emphasis transition-opacity hover:opacity-80"
            onClick={() => { window.location.href = getGoogleOAuthUrl(); }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google로 로그인
          </button>

          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#03C75A' }}
            onClick={() => { window.location.href = getNaverOAuthUrl(); }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
            </svg>
            Naver로 로그인
          </button>
        </div>

        {/* Bottom buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-control bg-surface px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-default transition-opacity duration-150 hover:opacity-80 active:opacity-70 font-pretendard"
            onClick={() => navigate('/signup')}
          >
            REGISTER
          </button>

          <button
            type="button"
            className="flex-1 cursor-pointer whitespace-nowrap rounded-control bg-surface px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-default transition-opacity duration-150 hover:opacity-80 active:opacity-70 font-pretendard"
            onClick={() => alert('아이디/비번 찾기 기능은 준비 중입니다.')}
          >
            아이디/비번 찾기
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
