import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput } from '@/components/common';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

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
