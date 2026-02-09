import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput } from '@/components/common';

const secondaryBtnClass =
  'w-[110px] shrink-0 cursor-pointer whitespace-nowrap rounded-control bg-surface px-4 py-3 text-[16px] leading-[24px] font-medium tracking-[-1px] text-default transition-opacity duration-150 hover:opacity-80 active:opacity-70 font-pretendard';

export default function SignUp() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSendCode = () => {
    // TODO: implement send verification code API
  };

  const handleVerify = () => {
    // TODO: implement verify code API
  };

  const handleRegister = () => {
    // TODO: implement register API
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
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                />
                <button
                  type="button"
                  className={secondaryBtnClass}
                  onClick={handleSendCode}
                >
                  SEND CODE
                </button>
              </div>
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
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button
                  type="button"
                  className={secondaryBtnClass}
                  onClick={handleVerify}
                >
                  VERIFY
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <ButtonDefault
                shape="rect"
                type="submit"
                className="w-[110px]"
              >
                REGISTER
              </ButtonDefault>
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
