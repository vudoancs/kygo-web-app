'use client';

import { useQuery } from '@tanstack/react-query';
import { isPublicApiConfigured } from '@/libs/env';
import { fetchCmsPostsPublic } from '@/services/cms.service';

export function useCmsPostsQuery(opts: {
  categoryCode?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const enabled = (opts.enabled ?? true) && isPublicApiConfigured();
  return useQuery({
    queryKey: ['cms-posts-public', opts.categoryCode, opts.keyword, opts.page, opts.limit],
    queryFn: () =>
      fetchCmsPostsPublic({
        categoryCode: opts.categoryCode,
        keyword: opts.keyword,
        page: opts.page ?? 1,
        limit: opts.limit ?? 9,
      }),
    enabled,
  });
}
