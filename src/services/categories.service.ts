import { unwrapKygoApiBody } from '@/libs/unwrap-api-body';
import { httpRequestOrThrow } from '@/services/http/client';
import type { WebCategoriesResponse } from '@/types/web-category.dto';

export async function fetchWebCategories(): Promise<WebCategoriesResponse> {
  const raw = await httpRequestOrThrow<unknown>('/web/categories', { method: 'GET' });
  return unwrapKygoApiBody<WebCategoriesResponse>(raw);
}
