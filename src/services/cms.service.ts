import { unwrapKygoApiBody } from '@/libs/unwrap-api-body';
import { httpRequestOrThrow } from '@/services/http/client';
import type { CmsCategory, CmsPost, CmsPostListResponse } from '@/types/cms';

async function unwrap<T>(path: string): Promise<T> {
  const raw = await httpRequestOrThrow<unknown>(path, { cache: 'no-store' });
  return unwrapKygoApiBody<T>(raw);
}

export async function fetchCmsCategories(): Promise<CmsCategory[]> {
  return unwrap<CmsCategory[]>(`/web/cms/categories`);
}

export async function fetchCmsPostsPublic(params: {
  categoryCode?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPostListResponse> {
  const sp = new URLSearchParams();
  if (params.categoryCode) sp.set('categoryCode', params.categoryCode);
  if (params.keyword) sp.set('keyword', params.keyword);
  if (params.page != null && params.page >= 1) sp.set('page', String(params.page));
  if (params.limit != null && params.limit >= 1) sp.set('limit', String(params.limit));
  const qs = sp.toString();
  return unwrap<CmsPostListResponse>(`/web/cms/posts${qs ? `?${qs}` : ''}`);
}

export async function fetchCmsPostBySlugPublic(slug: string): Promise<CmsPost> {
  const s = encodeURIComponent(String(slug || '').trim());
  return unwrap<CmsPost>(`/web/cms/posts/slug/${s}`);
}
