import { useQuery } from '@tanstack/react-query';
import { getOptions } from '@/api/option';
import type { OptionResponse } from '@/api/option';
import { useAuthStore } from '@/store/authStore';

const LANGUAGE_LOCALE_MAP: Record<number, string> = {
  1: 'ko',
  2: 'en',
};

export function useOptions(langOverride?: string) {
  const preferredLanguageId = useAuthStore((s) => s.user?.preferredLanguageId ?? null);
  const lang = langOverride ?? LANGUAGE_LOCALE_MAP[preferredLanguageId ?? 1] ?? 'ko';

  return useQuery<OptionResponse>({
    queryKey: ['options', lang],
    queryFn: () => getOptions(lang),
    staleTime: 10 * 60 * 1000, // 옵션 데이터는 10분 캐시
  });
}
