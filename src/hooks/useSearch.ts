import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import type { Filters } from '@/api/types';

export function useSearch(topic: string, filters: Filters) {
  return useQuery({
    queryKey: ['search', topic, filters],
    queryFn: () => api.search(topic, filters),
    staleTime: Infinity
  });
}
