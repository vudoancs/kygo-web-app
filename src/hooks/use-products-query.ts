'use client';

import { useQuery } from '@tanstack/react-query';
import { isPublicApiConfigured } from '@/libs/env';
import type { FetchProductsParams } from '@/services/products.service';
import {
  fetchProducts,
  fetchProductById,
  fetchNewProducts,
  fetchFeaturedProducts,
} from '@/services/products.service';
import { getErrorMessage } from '@/services/http/errors';

export type UseProductsQueryOptions = FetchProductsParams;

function keyPartArr(arr?: string[]): string {
  if (!arr?.length) return '';
  return JSON.stringify([...arr].map(String).sort());
}

export const productKeys = {
  all: ['products'] as const,
  list: (opts: UseProductsQueryOptions) => {
    const {
      category,
      page = 1,
      pageSize = 12,
      occasion,
      style,
      size,
      color,
      minPrice,
      maxPrice,
      search,
      listingMode,
      rentStart,
      rentEnd,
    } = opts;
    return [
      ...productKeys.all,
      'list',
      keyPartArr(category),
      page,
      pageSize,
      keyPartArr(occasion),
      keyPartArr(style),
      keyPartArr(size),
      keyPartArr(color),
      minPrice ?? '',
      maxPrice ?? '',
      search ?? '',
      listingMode ?? '',
      rentStart ?? '',
      rentEnd ?? '',
    ] as const;
  },
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};

export function useProductsQuery(options?: UseProductsQueryOptions | string) {
  const normalized: UseProductsQueryOptions =
    typeof options === 'string'
      ? { category: options && options !== 'all' ? [options] : undefined }
      : { ...(options ?? {}) };
  const { page = 1, pageSize = 12, ...rest } = normalized;
  const enabled = isPublicApiConfigured();
  const full: UseProductsQueryOptions = { page, pageSize, ...rest };
  return useQuery({
    queryKey: productKeys.list(full),
    queryFn: () => fetchProducts(full),
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}

export type UseNewProductsQueryOptions = Omit<UseProductsQueryOptions, 'isNew'>;

/** GET /web/products/new */
export function useNewProductsQuery(options?: UseNewProductsQueryOptions) {
  const { page = 1, pageSize = 12, ...rest } = options ?? {};
  const full: UseNewProductsQueryOptions = { page, pageSize, ...rest };
  const enabled = isPublicApiConfigured();
  return useQuery({
    queryKey: [...productKeys.list(full as UseProductsQueryOptions), 'path', 'new'] as const,
    queryFn: () => fetchNewProducts(full),
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}

export type UseFeaturedProductsQueryOptions = Omit<UseProductsQueryOptions, 'featured'>;

/** GET /web/products/featured */
export function useFeaturedProductsQuery(options?: UseFeaturedProductsQueryOptions) {
  const { page = 1, pageSize = 12, ...rest } = options ?? {};
  const full: UseFeaturedProductsQueryOptions = { page, pageSize, ...rest };
  const enabled = isPublicApiConfigured();
  return useQuery({
    queryKey: [...productKeys.list(full as UseProductsQueryOptions), 'path', 'featured'] as const,
    queryFn: () => fetchFeaturedProducts(full),
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}

export function useProductDetailQuery(id: string | undefined) {
  const enabled = Boolean(id) && isPublicApiConfigured();
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => fetchProductById(id!),
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}
