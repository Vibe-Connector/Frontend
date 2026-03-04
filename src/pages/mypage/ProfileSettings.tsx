import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput, Dropdown } from '@/components/common';
import { getMyProfile, updateProfile } from '@/api/user';
import { getSettings, updateSettings } from '@/api/user';
import { getSocialAccounts, unlinkSocialAccount } from '@/api/user';
import type { UserProfileResponse, UserSettingsResponse, SocialAccountResponse } from '@/api/user';
import { useAuthStore } from '@/store/authStore';
import { getGoogleOAuthUrl, getNaverOAuthUrl } from '@/utils/oauth';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

const countryOptions = [
  { value: 'kr', label: 'South Korea' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'gb', label: 'United Kingdom' },
];

const languageOptions = [
  { value: 'ko', label: 'Korean' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

const timezoneOptions = [
  { value: 'Asia/Seoul', label: 'KST (UTC+9)' },
  { value: 'America/New_York', label: 'EST (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'PST (UTC-8)' },
  { value: 'Asia/Tokyo', label: 'JST (UTC+9)' },
  { value: 'Europe/London', label: 'GMT (UTC+0)' },
];

export default function ProfileSettings() {
  // [BEFORE INTEGRATION] 하드코딩된 'Alexa Rawles', 'alexarawles@gmail.com'
  // [AFTER INTEGRATION] API에서 프로필 + 설정 데이터 로드
  const authUser = useAuthStore((s) => s.user);
  const updateAuthUser = useAuthStore((s) => s.updateUser);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [settings, setSettingsState] = useState<UserSettingsResponse | null>(null);
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [timezone, setTimezone] = useState('');
  const [saving, setSaving] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountResponse[]>([]);
  const [unlinking, setUnlinking] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((res: UserProfileResponse) => {
        setProfile(res);
        setFullName(res.name ?? '');
        setNickName(res.nickname ?? '');
        // BE는 대문자 MALE/FEMALE/OTHER를 저장하므로, FE 드롭다운 value(소문자)로 변환
        setGender(res.gender ? res.gender.toLowerCase() : '');
        setCountry(res.country ?? '');
        setTimezone(res.timezone ?? '');
        // preferredLanguageId → language 코드 변환
        const langMap: Record<number, string> = { 1: 'ko', 2: 'en', 3: 'ja', 4: 'zh' };
        setLanguage(res.preferredLanguageId ? (langMap[res.preferredLanguageId] ?? '') : '');
      })
      .catch(() => {/* 폴백: authStore 데이터 사용 */});

    getSettings()
      .then((res: UserSettingsResponse) => setSettingsState(res))
      .catch(() => {});

    getSocialAccounts()
      .then(setSocialAccounts)
      .catch(() => {});
  }, []);

  const displayName = profile?.nickname ?? authUser?.nickname ?? '';
  const displayEmail = profile?.email ?? authUser?.email ?? '';
  const displayAvatar = profile?.profileImageUrl ?? authUser?.profileImageUrl ?? null;

  const handleSave = () => {
    setSaving(true);

    // gender: 소문자 → 대문자 변환, 'prefer-not'은 전송하지 않음
    const genderValue = gender && gender !== 'prefer-not' ? gender.toUpperCase() : undefined;

    // language 코드 → preferredLanguageId 변환
    const langIdMap: Record<string, number> = { ko: 1, en: 2, ja: 3, zh: 4 };
    const preferredLanguageId = language ? langIdMap[language] : undefined;

    const profilePromise = updateProfile({
      name: fullName || undefined,
      nickname: nickName || undefined,
      gender: genderValue,
      preferredLanguageId,
      country: country || undefined,
      timezone: timezone || undefined,
    })
      .then((res) => {
        setProfile(res);
        updateAuthUser({
          nickname: res.nickname,
          profileImageUrl: res.profileImageUrl,
          preferredLanguageId: res.preferredLanguageId,
        });
      })
      .catch(() => {});

    const settingsPromise = settings
      ? updateSettings({
          pushEnabled: settings.pushEnabled,
          emailNotification: settings.emailNotification,
        }).catch(() => {})
      : Promise.resolve();

    Promise.all([profilePromise, settingsPromise])
      .finally(() => setSaving(false));
  };

  return (
    <PageContainer className="flex items-start justify-center">
      <div className="w-full max-w-[760px] rounded-card border border-stroke bg-white px-10 pt-10 pb-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-disabled">
            {displayAvatar && (
              <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
            )}
          </div>

          <div>
            <p className="text-[18px] font-semibold tracking-[-1px] text-high-emphasis">
              {displayName}
            </p>
            <p className="text-[14px] tracking-[-0.5px] text-caption">
              {displayEmail}
            </p>
          </div>
        </div>

        <ButtonDefault shape="rect" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </ButtonDefault>
      </div>

      {/* Form Fields */}
      <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6">
        {/* Row 1: Full Name / Nick Name */}
        <TextInput
          label="Full Name"
          placeholder="Your First Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextInput
          label="Nick Name"
          placeholder="Your Nick Name"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />

        {/* Row 2: Gender / Country */}
        <Dropdown
          label="Gender"
          placeholder="Select Gender"
          options={genderOptions}
          value={gender}
          onChange={setGender}
        />
        <Dropdown
          label="Country"
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
        />

        {/* Row 3: Language / Time Zone */}
        <Dropdown
          label="Language"
          placeholder="Select Language"
          options={languageOptions}
          value={language}
          onChange={setLanguage}
        />
        <Dropdown
          label="Time Zone"
          placeholder="Select Time Zone"
          options={timezoneOptions}
          value={timezone}
          onChange={setTimezone}
        />
      </div>

      {/* Notification Settings */}
      {settings && (
        <div className="mt-10">
          <h2 className="text-[16px] font-semibold tracking-[-1px] text-high-emphasis">
            Notification Settings
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 text-[14px] text-high-emphasis">
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={(e) =>
                  setSettingsState({ ...settings, pushEnabled: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
              Push 알림
            </label>
            <label className="flex items-center gap-3 text-[14px] text-high-emphasis">
              <input
                type="checkbox"
                checked={settings.emailNotification}
                onChange={(e) =>
                  setSettingsState({ ...settings, emailNotification: e.target.checked })
                }
                className="h-4 w-4 rounded"
              />
              이메일 알림
            </label>
          </div>
        </div>
      )}

      {/* Social Accounts */}
      <div className="mt-10">
        <h2 className="text-[16px] font-semibold tracking-[-1px] text-high-emphasis">
          소셜 계정 연동
        </h2>
        <div className="mt-4 space-y-3">
          {/* Google */}
          {(() => {
            const google = socialAccounts.find((a) => a.provider === 'GOOGLE');
            return (
              <div className="flex items-center justify-between rounded-control border border-stroke px-4 py-3">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-high-emphasis">Google</p>
                    {google && (
                      <p className="text-xs text-caption">
                        {new Date(google.linkedAt).toLocaleDateString('ko-KR')} 연동됨
                      </p>
                    )}
                  </div>
                </div>
                {google ? (
                  <button
                    type="button"
                    className="cursor-pointer rounded-control border border-stroke px-3 py-1.5 text-xs font-medium text-caption transition-opacity hover:opacity-80"
                    disabled={unlinking === 'GOOGLE'}
                    onClick={() => {
                      setUnlinking('GOOGLE');
                      unlinkSocialAccount('google')
                        .then(() => setSocialAccounts((prev) => prev.filter((a) => a.provider !== 'GOOGLE')))
                        .catch(() => {})
                        .finally(() => setUnlinking(null));
                    }}
                  >
                    {unlinking === 'GOOGLE' ? '...' : '연동 해제'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer rounded-control bg-brand px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    onClick={() => { window.location.href = getGoogleOAuthUrl('link'); }}
                  >
                    연동하기
                  </button>
                )}
              </div>
            );
          })()}

          {/* Naver */}
          {(() => {
            const naver = socialAccounts.find((a) => a.provider === 'NAVER');
            return (
              <div className="flex items-center justify-between rounded-control border border-stroke px-4 py-3">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="24" height="24" rx="4" fill="#03C75A" />
                    <path d="M15.273 12.845 10.376 6H8v12h4.727V11.155L17.624 18H20V6h-4.727z" fill="white" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-high-emphasis">Naver</p>
                    {naver && (
                      <p className="text-xs text-caption">
                        {new Date(naver.linkedAt).toLocaleDateString('ko-KR')} 연동됨
                      </p>
                    )}
                  </div>
                </div>
                {naver ? (
                  <button
                    type="button"
                    className="cursor-pointer rounded-control border border-stroke px-3 py-1.5 text-xs font-medium text-caption transition-opacity hover:opacity-80"
                    disabled={unlinking === 'NAVER'}
                    onClick={() => {
                      setUnlinking('NAVER');
                      unlinkSocialAccount('naver')
                        .then(() => setSocialAccounts((prev) => prev.filter((a) => a.provider !== 'NAVER')))
                        .catch(() => {})
                        .finally(() => setUnlinking(null));
                    }}
                  >
                    {unlinking === 'NAVER' ? '...' : '연동 해제'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer rounded-control px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#03C75A' }}
                    onClick={() => { window.location.href = getNaverOAuthUrl('link'); }}
                  >
                    연동하기
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* My email Address */}
      <div className="mt-10">
        <h2 className="text-[16px] font-semibold tracking-[-1px] text-high-emphasis">
          My email Address
        </h2>

        {/* Email entry */}
        <div className="mt-4 flex items-center gap-3">
          {/* Email icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
              <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
            </svg>
          </div>

          <div>
            <p className="text-[14px] font-medium tracking-[-0.5px] text-high-emphasis">
              {displayEmail}
            </p>
            <p className="text-[12px] tracking-[-0.5px] text-caption">
              {profile?.lastLoginAt
                ? new Date(profile.lastLoginAt).toLocaleDateString('ko-KR')
                : '1 month ago'}
            </p>
          </div>
        </div>

        {/* Add Email Address */}
        <button
          type="button"
          className="mt-4 cursor-pointer rounded-control border border-blue px-4 py-2 text-[14px] font-medium tracking-[-0.5px] text-blue transition-opacity duration-150 hover:opacity-80 font-pretendard"
          onClick={() => alert('+Add Email Address 기능은 준비 중입니다.')}
        >
          +Add Email Address
        </button>
      </div>
      </div>
    </PageContainer>
  );
}
