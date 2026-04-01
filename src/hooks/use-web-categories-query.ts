'use client';

import { useQuery } from '@tanstack/react-query';
import { isPublicApiConfigured } from '@/libs/env';
import { fetchWebCategories } from '@/services/categories.service';
import { getErrorMessage } from '@/services/http/errors';

export const webCategoryKeys = {
  all: ['web', 'categories'] as const,
  tree: () => [...webCategoryKeys.all, 'tree'] as const,
};

export function useWebCategoriesQuery() {
  const enabled = isPublicApiConfigured();
  return useQuery({
    queryKey: webCategoryKeys.tree(),
    queryFn: fetchWebCategories,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    meta: { getErrorMessage },
  });
}
