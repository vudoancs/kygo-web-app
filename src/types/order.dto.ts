export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface OrderLineDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  rawStatus?: string;
  status: OrderStatus;
  paymentStatus?: string;
  lines: OrderLineDto[];
  subtotal?: number;
  totalDeposit?: number;
  total: number;
  createdAt: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  venue?: string;
}
