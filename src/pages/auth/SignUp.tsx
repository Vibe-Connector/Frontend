import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput } from '@/components/common';
import { signup, socialSignup, checkEmail, sendVerificationCode, verifyCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getGoogleOAuthUrl, getNaverOAuthUrl } from '@/utils/oauth';

const secondaryBtnClass =
  'w-[110px] shrink-0 cursor-pointer whitespace-nowrap rounded-control bg-surface px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-default transition-opacity duration-150 hover:opacity-80 active:opacity-70 font-pretendard';

const disabledBtnClass =
  'w-[110px] shrink-0 whitespace-nowrap rounded-control bg-disabled px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-low-emphasis font-pretendard cursor-not-allowed';

interface SocialSignupData {
  socialSignupToken: string;
  email: string;
  profileImageUrl: string;
}

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const authLogin = useAuthStore((s) => s.login);

  // 소셜 회원가입 모드
  const [socialData, setSocialData] = useState<SocialSignupData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('socialSignup');
    if (raw) {
      try {
        const data: SocialSignupData = JSON.parse(raw);
        setSocialData(data);
        if (data.email) {
          setEmail(data.email);
          setEmailVerified(true);
        }
      } catch {
        // invalid data, ignore
      }
      sessionStorage.removeItem('socialSignup');
    }
  }, []);

  const isSocialMode = socialData !== null;

  const handleSendCode = async () => {
    if (!email) {
      setEmailStatus(t('auth.emailRequired'));
      return;
    }
    setCodeSending(true);
    setEmailStatus('');
    try {
      // 1. 이메일 중복 확인
      const result = await checkEmail(email);
      if (!result.available) {
        setEmailStatus(t('auth.emailExists'));
        return;
      }
      // 2. 인증 코드 발송
      await sendVerificationCode(email);
      setCodeSent(true);
      setEmailVerified(false);
      setVerifyStatus('');
      setVerificationCodeInput('');
      setEmailStatus(t('auth.codeSent'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '인증 코드 발송에 실패했습니다.';
      setEmailStatus(message);
    } finally {
      setCodeSending(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCodeInput) {
      setVerifyStatus(t('auth.codeRequired'));
      return;
    }
    setVerifying(true);
    setVerifyStatus('');
    try {
      const result = await verifyCode(email, verificationCodeInput);
      if (result.verified) {
        setEmailVerified(true);
        setVerifyStatus(t('auth.emailVerified'));
        setEmailStatus('');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '인증 코드 확인에 실패했습니다.';
      setVerifyStatus(message);
    } finally {
      setVerifying(false);
    }
  };

  const handleRegister = async () => {
    if (!isSocialMode && !emailVerified) {
      setError(t('auth.emailVerificationNeeded'));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (!nickname.trim()) {
      setError(t('auth.nicknameRequired'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.passwordMinLength'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isSocialMode) {
        // 소셜 회원가입
        const data = await socialSignup({
          socialSignupToken: socialData.socialSignupToken,
          nickname,
          password,
        });
        authLogin(data);
      } else {
        // 일반 회원가입
        const data = await signup({ email, password, nickname });
        authLogin(data);
      }
      navigate('/explore');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('auth.signupFailed');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[calc(100vh-var(--spacing-header)-var(--spacing-footer))] items-center justify-center">
      <div className="w-full max-w-[760px] rounded-card border border-stroke bg-white px-10 pt-10 pb-8">
        {/* Title */}
        <div className="mb-8 flex items-start gap-2">
          <h1 className="text-[28px] leading-tight font-bold tracking-[-1px] text-high-emphasis">
            {isSocialMode ? (
              <>
                COMPLETE YOUR
                <br />
                REGISTRATION
              </>
            ) : (
              <>
                WHAT DO YOU TRY
                <br />
                TO GET FROM
                <br />
                HERE?
              </>
            )}
          </h1>

          {!isSocialMode && (
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
          )}
        </div>

        {isSocialMode && (
          <p className="mb-6 text-sm text-caption">
            {t('auth.socialComplete')}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          {/* Row 1: NICKNAME / PASSWORD */}
          <div className="grid grid-cols-2 gap-6">
            <TextInput
              label={t('auth.nickname')}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="nickname"
            />

            <TextInput
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Row 2: EMAIL + SEND CODE / PASSWORD DOUBLE CHECK */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1 block text-[13px] font-medium tracking-[-1px] text-high-emphasis">
                {t('auth.email')}
              </label>
              <div className="flex gap-2">
                <TextInput
                  value={email}
                  onChange={(e) => {
                    if (isSocialMode) return; // 소셜 모드에서는 변경 불가
                    setEmail(e.target.value);
                    if (emailVerified || codeSent) {
                      setEmailVerified(false);
                      setCodeSent(false);
                      setEmailStatus('');
                      setVerifyStatus('');
                      setVerificationCodeInput('');
                    }
                  }}
                  type="email"
                  autoComplete="email"
                  readOnly={emailVerified || isSocialMode}
                />
                {!isSocialMode && (
                  <button
                    type="button"
                    className={emailVerified ? disabledBtnClass : secondaryBtnClass}
                    onClick={handleSendCode}
                    disabled={codeSending || emailVerified}
                  >
                    {codeSending ? '...' : codeSent ? t('auth.resend') : t('auth.sendCode')}
                  </button>
                )}
              </div>
              {isSocialMode && (
                <p className="mt-1 text-xs text-green-600">소셜 인증으로 확인된 이메일</p>
              )}
              {!isSocialMode && emailStatus && (
                <p className={`mt-1 text-xs ${emailVerified ? 'text-green-600' : codeSent ? 'text-blue-600' : 'text-accent'}`}>
                  {emailStatus}
                </p>
              )}
            </div>

            <TextInput
              label={t('auth.passwordCheck')}
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Row 3: VERIFICATION CODE + VERIFY / REGISTER */}
          <div className="mt-6 grid grid-cols-2 items-end gap-6">
            {!isSocialMode ? (
              <div>
                <label className="mb-1 block text-[13px] font-medium tracking-[-1px] text-high-emphasis">
                  {t('auth.verificationCode')}
                </label>
                <div className="flex gap-2">
                  <TextInput
                    value={verificationCodeInput}
                    onChange={(e) => setVerificationCodeInput(e.target.value)}
                    readOnly={emailVerified}
                    placeholder={codeSent ? '6자리 코드 입력' : ''}
                  />
                  <button
                    type="button"
                    className={emailVerified || !codeSent ? disabledBtnClass : secondaryBtnClass}
                    onClick={handleVerify}
                    disabled={verifying || emailVerified || !codeSent}
                  >
                    {verifying ? '...' : emailVerified ? t('auth.verified') : t('auth.verify')}
                  </button>
                </div>
                {verifyStatus && (
                  <p className={`mt-1 text-xs ${emailVerified ? 'text-green-600' : 'text-accent'}`}>
                    {verifyStatus}
                  </p>
                )}
              </div>
            ) : (
              <div />
            )}

            <div className="flex flex-col items-end gap-2">
              {error && <p className="text-sm text-accent">{error}</p>}
              <ButtonDefault
                shape="rect"
                type="submit"
                className="w-[110px]"
                disabled={loading}
              >
                {loading ? '...' : t('auth.register')}
              </ButtonDefault>
            </div>
          </div>
        </form>

        {/* Divider & Social buttons — 일반 모드만 표시 */}
        {!isSocialMode && (
          <>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-stroke" />
              <span className="text-xs text-caption">{t('auth.divider')}</span>
              <div className="h-px flex-1 bg-stroke" />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-control border border-stroke bg-white px-4 py-3 text-sm font-medium text-high-emphasis transition-opacity hover:opacity-80"
                onClick={() => { window.location.href = getGoogleOAuthUrl(); }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {t('auth.googleSignup')}
              </button>

              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#03C75A' }}
                onClick={() => { window.location.href = getNaverOAuthUrl(); }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
                </svg>
                {t('auth.naverSignup')}
              </button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
