export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface OrderLineDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  id: string;
  status: OrderStatus;
  lines: OrderLineDto[];
  total: number;
  createdAt: string;
}
