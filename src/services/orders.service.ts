import { httpRequestOrThrow } from '@/services/http/client';
import type { OrderDto } from '@/types/order.dto';

export async function fetchMyOrders(): Promise<OrderDto[]> {
  return httpRequestOrThrow<OrderDto[]>('/web/orders/me', {
    method: 'GET',
    auth: true,
  });
}

export async function fetchOrderById(id: string): Promise<OrderDto> {
  return httpRequestOrThrow<OrderDto>(`/web/orders/${id}`, {
    method: 'GET',
    auth: true,
  });
}
