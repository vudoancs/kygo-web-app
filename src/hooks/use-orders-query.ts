'use client';

import { useQuery } from '@tanstack/react-query';
import { isPublicApiConfigured } from '@/libs/env';
import { fetchMyOrders, fetchOrderById } from '@/services/orders.service';
import { getErrorMessage } from '@/services/http/errors';

export const orderKeys = {
  all: ['orders'] as const,
  mine: () => [...orderKeys.all, 'mine'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export function useMyOrdersQuery() {
  const enabled = isPublicApiConfigured();
  return useQuery({
    queryKey: orderKeys.mine(),
    queryFn: fetchMyOrders,
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}

export function useOrderDetailQuery(id: string | undefined) {
  const enabled = Boolean(id) && isPublicApiConfigured();
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => fetchOrderById(id!),
    enabled,
    retry: 1,
    meta: { getErrorMessage },
  });
}
