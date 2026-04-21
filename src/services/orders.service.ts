import { unwrapKygoApiBody } from '@/libs/unwrap-api-body';
import { httpRequestOrThrow } from '@/services/http/client';
import type { OrderDto } from '@/types/order.dto';

export type WebCheckoutItemPayload = {
  productId: string;
  quantity: number;
  type: 'rent' | 'buy';
  rentStartDate?: string;
  rentDuration?: number;
};

export type WebCheckoutPayload = {
  items: WebCheckoutItemPayload[];
  notes?: string;
  deliveryMethod?: 'delivery' | 'pickup';
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
};

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

/** POST /web/orders/checkout — cần JWT + Customer ERP trùng email đăng nhập. */
export async function checkoutWeb(body: WebCheckoutPayload): Promise<OrderDto> {
  const raw = await httpRequestOrThrow<unknown>('/web/orders/checkout', {
    method: 'POST',
    body,
    auth: true,
  });
  return unwrapKygoApiBody<OrderDto>(raw);
}
