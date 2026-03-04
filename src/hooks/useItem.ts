import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '@/api/item';
import type { ItemCategory, ItemDetailResponse } from '@/api/item';

export function useItemDetail(itemId: number | null, category: ItemCategory) {
  return useQuery({
    queryKey: ['items', itemId, category],
    // interceptor가 AxiosResponse → data로 언래핑하므로 실제 반환 타입은 ItemDetailResponse
    queryFn: () => getItemDetail(itemId!, category) as unknown as Promise<ItemDetailResponse>,
    enabled: itemId !== null,
  });
}
