import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOptions } from '@/api/option';
import type { OptionResponse } from '@/api/option';

export function useOptions(langOverride?: string) {
  const { i18n } = useTranslation();
  const lang = langOverride ?? i18n.language ?? 'ko';

  return useQuery<OptionResponse>({
    queryKey: ['options', lang],
    queryFn: () => getOptions(lang),
    staleTime: 10 * 60 * 1000,
  });
}
