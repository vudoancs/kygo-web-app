'use client';

import { useQuery } from '@tanstack/react-query';
import { isPublicApiConfigured } from '@/libs/env';
import type { FetchProductsParams } from '@/services/products.service';
import {
  fetchProducts,
  fetchProductById,
  fetchNewProducts,
  fetchFeaturedProducts,
  fetchSimilarProducts,
  fetchWebProductBrands,
  fetchWebProductRentalCalendar,
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
      sortBy,
      sortOrder,
      brand,
    } = opts;
    return [
      ...productKeys.all,
      'list',
      keyPartArr(category),
      keyPartArr(brand),
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
      sortBy ?? '',
      sortOrder ?? '',
    ] as const;
  },
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  similar: (id: string, limit: number) => [...productKeys.all, 'similar', id, limit] as const,
  brands: () => [...productKeys.all, 'brands'] as const,
  rentalCalendar: (id: string, from: string, to: string) =>
    [...productKeys.all, 'rental-calendar', id, from, to] as const,
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

export function useSimilarProductsQuery(id: string | undefined, limit = 4) {
  const enabled = Boolean(id) && isPublicApiConfigured();
  return useQuery({
    queryKey: productKeys.similar(id ?? '', limit),
    queryFn: () => fetchSimilarProducts(id!, limit),
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}

export function useWebProductBrandsQuery() {
  const enabled = isPublicApiConfigured();
  return useQuery({
    queryKey: productKeys.brands(),
    queryFn: fetchWebProductBrands,
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
    meta: { getErrorMessage },
  });
}

export function useProductRentalCalendarQuery(
  productId: string | undefined,
  range: { fromDate: string; toDate: string } | undefined,
) {
  const enabled =
    Boolean(productId) &&
    Boolean(range?.fromDate && range?.toDate) &&
    isPublicApiConfigured();
  return useQuery({
    queryKey: productKeys.rentalCalendar(
      productId ?? '',
      range?.fromDate ?? '',
      range?.toDate ?? '',
    ),
    queryFn: () =>
      fetchWebProductRentalCalendar(productId!, {
        fromDate: range!.fromDate,
        toDate: range!.toDate,
      }),
    enabled,
    staleTime: 60_000,
    retry: 1,
    meta: { getErrorMessage },
  });
}
