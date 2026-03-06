import { useState } from 'react';

interface MoodInputBubbleProps {
  onSubmit: (keyword: string) => void;
  customCount: number;
  maxCustom: number;
  disabled?: boolean;
}

export default function MoodInputBubble({
  onSubmit,
  customCount,
  maxCustom,
  disabled = false,
}: MoodInputBubbleProps) {
  const [value, setValue] = useState('');
  const isMaxReached = customCount >= maxCustom;
  const isDisabled = disabled || isMaxReached;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isDisabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <div className="flex gap-2">
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
        placeholder={
          isMaxReached
            ? `최대 ${maxCustom}개까지 추가 가능`
            : '기분을 직접 입력해보세요'
        }
        disabled={isDisabled}
        className="flex-1 rounded-control border border-stroke bg-white px-4 py-2.5 text-sm text-high-emphasis placeholder:text-caption outline-none focus:border-accent disabled:opacity-40"
        aria-label="커스텀 무드 키워드 입력"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isDisabled || !value.trim()}
        className="shrink-0 cursor-pointer rounded-control bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        추가
      </button>
    </div>
  );
}
