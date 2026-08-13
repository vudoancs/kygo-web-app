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

export type OrderLineType = 'rent' | 'buy';
export type OrderKind = 'rent' | 'buy' | 'mixed';

export interface OrderLineDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  /** Thành tiền dòng */
  lineTotal?: number;
  type?: OrderLineType;
  images?: string[];
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  rawStatus?: string;
  status: OrderStatus;
  paymentStatus?: string;
  lines: OrderLineDto[];
  /** Loại đơn: thuê / mua / hỗn hợp */
  orderKind?: OrderKind;
  subtotal?: number;
  totalDeposit?: number;
  total: number;
  /** Đã thanh toán (payments − refunds) */
  paidAmount?: number;
  /** Còn lại phải thanh toán */
  remainingAmount?: number;
  createdAt: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  pickupTime?: string;
  returnTime?: string;
  venue?: string;
}
