import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput } from '@/components/common';
import { signup, checkEmail, sendVerificationCode, verifyCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const secondaryBtnClass =
  'w-[110px] shrink-0 cursor-pointer whitespace-nowrap rounded-control bg-surface px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-default transition-opacity duration-150 hover:opacity-80 active:opacity-70 font-pretendard';

const disabledBtnClass =
  'w-[110px] shrink-0 whitespace-nowrap rounded-control bg-disabled px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-low-emphasis font-pretendard cursor-not-allowed';

export default function SignUp() {
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

  const handleSendCode = async () => {
    if (!email) {
      setEmailStatus('이메일을 입력해 주세요.');
      return;
    }
    setCodeSending(true);
    setEmailStatus('');
    try {
      // 1. 이메일 중복 확인
      const result = await checkEmail(email);
      if (!result.available) {
        setEmailStatus('이미 사용 중인 이메일입니다.');
        return;
      }
      // 2. 인증 코드 발송
      await sendVerificationCode(email);
      setCodeSent(true);
      setEmailVerified(false);
      setVerifyStatus('');
      setVerificationCodeInput('');
      setEmailStatus('인증 코드가 발송되었습니다. 이메일을 확인해 주세요.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '인증 코드 발송에 실패했습니다.';
      setEmailStatus(message);
    } finally {
      setCodeSending(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCodeInput) {
      setVerifyStatus('인증 코드를 입력해 주세요.');
      return;
    }
    setVerifying(true);
    setVerifyStatus('');
    try {
      const result = await verifyCode(email, verificationCodeInput);
      if (result.verified) {
        setEmailVerified(true);
        setVerifyStatus('이메일 인증이 완료되었습니다.');
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
    if (!emailVerified) {
      setError('이메일 인증을 완료해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await signup({ email, password, nickname });
      authLogin(data);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
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
            WHAT DO YOU TRY
            <br />
            TO GET FROM
            <br />
            HERE?
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
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          {/* Row 1: NICKNAME / PASSWORD */}
          <div className="grid grid-cols-2 gap-6">
            <TextInput
              label="NICKNAME"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="nickname"
            />

            <TextInput
              label="PASSWORD"
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
                EMAIL
              </label>
              <div className="flex gap-2">
                <TextInput
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // 이메일 변경 시 인증 상태 리셋
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
                  readOnly={emailVerified}
                />
                <button
                  type="button"
                  className={emailVerified ? disabledBtnClass : secondaryBtnClass}
                  onClick={handleSendCode}
                  disabled={codeSending || emailVerified}
                >
                  {codeSending ? '...' : codeSent ? 'RE-SEND' : 'SEND CODE'}
                </button>
              </div>
              {emailStatus && (
                <p className={`mt-1 text-xs ${emailVerified ? 'text-green-600' : codeSent ? 'text-blue-600' : 'text-accent'}`}>
                  {emailStatus}
                </p>
              )}
            </div>

            <TextInput
              label="PASSWORD DOUBLE CHECK"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Row 3: VERIFICATION CODE + VERIFY / REGISTER */}
          <div className="mt-6 grid grid-cols-2 items-end gap-6">
            <div>
              <label className="mb-1 block text-[13px] font-medium tracking-[-1px] text-high-emphasis">
                VERIFICATION CODE
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
                  {verifying ? '...' : emailVerified ? 'VERIFIED' : 'VERIFY'}
                </button>
              </div>
              {verifyStatus && (
                <p className={`mt-1 text-xs ${emailVerified ? 'text-green-600' : 'text-accent'}`}>
                  {verifyStatus}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {error && <p className="text-sm text-accent">{error}</p>}
              <ButtonDefault
                shape="rect"
                type="submit"
                className="w-[110px]"
                disabled={loading}
              >
                {loading ? '...' : 'REGISTER'}
              </ButtonDefault>
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
