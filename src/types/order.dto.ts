export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

/** Trạng thái gốc ERP — đồng bộ kygo-erp-api OrderStatus */
export type ErpOrderStatus =
  | 'PENDING_CONFIRM'
  | 'CONFIRMED'
  | 'WAITING_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED'
  | 'WAITING_REFUND'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderLineDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  images?: string[];
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
  pickupTime?: string;
  returnTime?: string;
  venue?: string;
}
