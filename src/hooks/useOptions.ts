import { useQuery } from '@tanstack/react-query';
import { getOptions } from '@/api/option';
import type { OptionResponse } from '@/api/option';

export function useOptions(lang = 'ko') {
  return useQuery<OptionResponse>({
    queryKey: ['options', lang],
    queryFn: () => getOptions(lang),
    staleTime: 10 * 60 * 1000, // 옵션 데이터는 10분 캐시
  });
}
