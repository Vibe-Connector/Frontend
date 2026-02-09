import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonDefault, TextInput, Dropdown } from '@/components/common';

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

export default function Profile() {
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [timezone, setTimezone] = useState('');

  return (
    <PageContainer className="flex items-start justify-center">
      <div className="w-full max-w-[760px] rounded-card border border-stroke bg-white px-10 pt-10 pb-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-disabled" />

          <div>
            <p className="text-[18px] font-semibold tracking-[-1px] text-high-emphasis">
              Alexa Rawles
            </p>
            <p className="text-[14px] tracking-[-0.5px] text-caption">
              alexarawles@gmail.com
            </p>
          </div>
        </div>

        <ButtonDefault shape="rect" onClick={() => alert('Edit 기능은 준비 중입니다.')}>
          Edit
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
          placeholder="Your First Name"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />

        {/* Row 2: Gender / Country */}
        <Dropdown
          label="Gender"
          placeholder="Your First Name"
          options={genderOptions}
          value={gender}
          onChange={setGender}
        />
        <Dropdown
          label="Country"
          placeholder="Your First Name"
          options={countryOptions}
          value={country}
          onChange={setCountry}
        />

        {/* Row 3: Language / Time Zone */}
        <Dropdown
          label="Language"
          placeholder="Your First Name"
          options={languageOptions}
          value={language}
          onChange={setLanguage}
        />
        <Dropdown
          label="Time Zone"
          placeholder="Your First Name"
          options={timezoneOptions}
          value={timezone}
          onChange={setTimezone}
        />
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
              alexarawles@gmail.com
            </p>
            <p className="text-[12px] tracking-[-0.5px] text-caption">
              1 month ago
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
