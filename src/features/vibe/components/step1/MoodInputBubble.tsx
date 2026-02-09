import { useState } from 'react';

interface MoodInputBubbleProps {
  onSubmit: (keyword: string) => void;
  customCount: number;
  maxCustom: number;
}

export default function MoodInputBubble({ onSubmit, customCount, maxCustom }: MoodInputBubbleProps) {
  const [value, setValue] = useState('');
  const isDisabled = customCount >= maxCustom;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isDisabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-stroke bg-white px-6 py-5"
      style={{
        borderRadius: '50% 45% 50% 42% / 42% 50% 45% 50%',
        minWidth: '180px',
        minHeight: '120px',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="기분을 입력해보세요"
        disabled={isDisabled}
        className="w-full bg-transparent text-center text-sm font-medium text-high-emphasis placeholder:text-caption outline-none disabled:opacity-40"
        aria-label="커스텀 무드 키워드 입력"
      />
      {isDisabled ? (
        <p className="mt-1 text-xs text-caption">최대 {maxCustom}개까지</p>
      ) : (
        <p className="mt-1 text-xs text-caption">Enter로 추가</p>
      )}
    </div>
  );
}
