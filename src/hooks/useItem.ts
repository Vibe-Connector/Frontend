import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '@/api/item';
import type { ItemCategory } from '@/api/item';

export function useItemDetail(itemId: number | null, category: ItemCategory) {
  return useQuery({
    queryKey: ['items', itemId, category],
    queryFn: () => getItemDetail(itemId!, category),
    enabled: itemId !== null,
  });
}
