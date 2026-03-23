import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
            ? t('vibe.customMoodMaxed', { max: maxCustom })
            : t('vibe.customMoodPlaceholder')
        }
        disabled={isDisabled}
        className="flex-1 rounded-control border border-stroke bg-white px-4 py-2.5 text-sm text-high-emphasis placeholder:text-caption outline-none focus:border-accent disabled:opacity-40"
        aria-label={t('vibe.customMoodAria')}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isDisabled || !value.trim()}
        className="shrink-0 cursor-pointer rounded-control bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('vibe.customMoodAdd')}
      </button>
    </div>
  );
}
