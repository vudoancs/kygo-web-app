'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  User as UserIcon,
  AlertCircle,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useMyOrdersQuery } from '@/hooks/use-orders-query';
import { isPublicApiConfigured } from '@/libs/env';
import type { OrderDto } from '@/types/order.dto';
import { OrderProductThumb } from '@/components/OrderProductThumb';
import { ShopContactButtons } from '@/components/ShopContactButtons';
import {
  OrderPaymentDialog,
  type OrderPaymentMode,
} from '@/components/OrderPaymentDialog';

type OrderTabId =
  | 'all'
  | 'pending_confirm'
  | 'confirmed'
  | 'renting'
  | 'returned'
  | 'waiting_refund'
  | 'completed'
  | 'cancelled';

const RAW_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING_CONFIRM: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  WAITING_DELIVERY: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  DELIVERED: { label: 'Đang thuê', color: 'bg-purple-100 text-purple-800' },
  RETURNED: { label: 'Đã trả', color: 'bg-indigo-100 text-indigo-800' },
  WAITING_REFUND: { label: 'Chờ hoàn cọc', color: 'bg-orange-100 text-orange-800' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800' },
  CANCELLED: { label: 'Hủy', color: 'bg-red-100 text-red-800' },
};

function getRawStatus(order: OrderDto): string {
  return String(order.rawStatus || '').toUpperCase();
}

function getPaidAmount(order: OrderDto): number {
  return Math.max(0, Number(order.paidAmount ?? 0));
}

function getRemainingAmount(order: OrderDto): number {
  return Math.max(
    0,
    Number(order.remainingAmount ?? Math.max(0, order.total - getPaidAmount(order))),
  );
}

/** Chờ xác nhận + chưa thanh toán → đặt cọc */
function canPayDeposit(order: OrderDto): boolean {
  const raw = getRawStatus(order);
  const pending =
    raw === 'PENDING_CONFIRM' || (!raw && order.status === 'pending');
  return pending && getPaidAmount(order) <= 0;
}

/** Đang thuê / đã trả / hoàn thành + còn nợ → thanh toán phần còn lại */
function canPayRemaining(order: OrderDto): boolean {
  const raw = getRawStatus(order);
  const eligible =
    raw === 'DELIVERED' ||
    raw === 'RETURNED' ||
    raw === 'COMPLETED' ||
    order.status === 'completed';
  return eligible && getRemainingAmount(order) > 0;
}

function getStatusMeta(order: OrderDto): { label: string; color: string } {
  const raw = getRawStatus(order);
  if (raw && RAW_STATUS_LABEL[raw]) return RAW_STATUS_LABEL[raw];

  const fallback: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-800' },
    paid: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Đang thuê', color: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800' },
    cancelled: { label: 'Hủy', color: 'bg-red-100 text-red-800' },
  };
  return fallback[order.status] || { label: 'Đang xử lý', color: 'bg-gray-100 text-gray-700' };
}

function matchesTab(order: OrderDto, tab: OrderTabId): boolean {
  if (tab === 'all') return true;
  const raw = getRawStatus(order);

  switch (tab) {
    case 'pending_confirm':
      return raw === 'PENDING_CONFIRM' || (!raw && order.status === 'pending');
    case 'confirmed':
      return raw === 'CONFIRMED' || raw === 'WAITING_DELIVERY';
    case 'renting':
      return raw === 'DELIVERED';
    case 'returned':
      return raw === 'RETURNED';
    case 'waiting_refund':
      return raw === 'WAITING_REFUND';
    case 'completed':
      return raw === 'COMPLETED' || order.status === 'completed';
    case 'cancelled':
      return raw === 'CANCELLED' || order.status === 'cancelled';
    default:
      return true;
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

function formatDate(value?: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('vi-VN');
}

function formatRentalSchedule(order: OrderDto): string | null {
  if (!order.rentalStartDate && !order.rentalEndDate) return null;
  const start = formatDate(order.rentalStartDate);
  const end = formatDate(order.rentalEndDate);
  const pickup = order.pickupTime || '12:00';
  const ret = order.returnTime || '12:00';
  if (start === end) {
    return `${pickup} ${start} → ${ret} ${end}`;
  }
  return `Nhận ${pickup} ${start} · Trả ${ret} ${end}`;
}

const MyOrders = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderTabId>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<{
    order: OrderDto;
    mode: OrderPaymentMode;
  } | null>(null);

  const myOrdersQuery = useMyOrdersQuery();

  const orders = useMemo((): OrderDto[] => {
    if (!isPublicApiConfigured()) return [];
    return myOrdersQuery.data ?? [];
  }, [myOrdersQuery.data]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesTab(order, activeTab)),
    [activeTab, orders],
  );

  const copyOrderNumber = async (order: OrderDto) => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopiedOrderId(order.id);
      window.setTimeout(() => {
        setCopiedOrderId((prev) => (prev === order.id ? null : prev));
      }, 1800);
    } catch {
      alert('Không thể copy mã đơn. Vui lòng copy thủ công.');
    }
  };

  const tabItems = useMemo(() => {
    const count = (tab: OrderTabId) => orders.filter((o) => matchesTab(o, tab)).length;
    return [
      { id: 'all' as const, label: 'Tất cả', count: count('all') },
      { id: 'pending_confirm' as const, label: 'Chờ xác nhận', count: count('pending_confirm') },
      { id: 'confirmed' as const, label: 'Đã xác nhận', count: count('confirmed') },
      { id: 'renting' as const, label: 'Đang thuê', count: count('renting') },
      { id: 'returned' as const, label: 'Đã trả', count: count('returned') },
      { id: 'waiting_refund' as const, label: 'Chờ hoàn cọc', count: count('waiting_refund') },
      { id: 'completed' as const, label: 'Hoàn thành', count: count('completed') },
      { id: 'cancelled' as const, label: 'Hủy', count: count('cancelled') },
    ];
  }, [orders]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <UserIcon className="w-8 h-8 text-[#b8465f]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem đơn hàng của mình</p>
          <button
            onClick={() => router.push('/login?redirect=/my-orders')}
            className="bg-[#b8465f] text-white px-8 py-3 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (!isPublicApiConfigured()) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa cấu hình API</h2>
          <p className="text-gray-600">Trang “Đơn hàng của tôi” cần cấu hình API để tải dữ liệu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        <p className="text-gray-600 mt-2">Quản lý đơn hàng và theo dõi lịch thuê</p>
      </div>

      {myOrdersQuery.isPending ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      ) : myOrdersQuery.isError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Không tải được đơn hàng</p>
              <p className="text-sm text-gray-600 mt-1">Vui lòng thử lại.</p>
              <button
                onClick={() => myOrdersQuery.refetch()}
                className="mt-4 bg-[#b8465f] text-white px-5 py-2 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
              >
                Tải lại
              </button>
            </div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h2>
          <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-[#b8465f] text-white px-8 py-3 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
          >
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabItems.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-rose-100 text-[#b8465f]'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-xs ${
                        isActive ? 'bg-white/70 text-[#b8465f]' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold">Không có đơn hàng nào trong mục này</p>
              <p className="text-sm text-gray-600 mt-1">Bạn có thể chọn tab khác để xem thêm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredOrders.map((order) => {
                const statusMeta = getStatusMeta(order);
                const rentalSchedule = formatRentalSchedule(order);
                const paidAmount = getPaidAmount(order);
                const remainingAmount = getRemainingAmount(order);
                const showDepositPay = canPayDeposit(order);
                const showRemainingPay = canPayRemaining(order);
                const isCopied = copiedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Mã đơn hàng</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <button
                              type="button"
                              onClick={() => copyOrderNumber(order)}
                              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-[#b8465f] hover:text-[#b8465f]"
                              title="Copy mã đơn"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  Đã copy
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ngày đặt</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusMeta.color}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-start gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="font-bold text-lg text-[#b8465f]">{formatPrice(order.total)}</p>
                          <div className="mt-1 space-y-0.5 text-xs">
                            <p className="text-emerald-700">
                              Đã thanh toán:{' '}
                              <span className="font-semibold">{formatPrice(paidAmount)}</span>
                            </p>
                            <p className={remainingAmount > 0 ? 'text-amber-700' : 'text-gray-500'}>
                              Còn lại:{' '}
                              <span className="font-semibold">{formatPrice(remainingAmount)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="mb-1 text-xs font-medium text-gray-500">Liên hệ shop</p>
                          <ShopContactButtons compact className="justify-end" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {order.lines.map((line) => (
                          <div key={`${order.id}-${line.productId}`} className="flex gap-4">
                            <OrderProductThumb
                              productId={line.productId}
                              name={line.name}
                              images={line.images}
                            />
                            <div className="flex-1 min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  window.open(
                                    `/product/${encodeURIComponent(line.productId)}`,
                                    '_blank',
                                    'noopener,noreferrer',
                                  )
                                }
                                className="text-left font-semibold text-gray-900 hover:text-[#b8465f] transition-colors"
                              >
                                {line.name}
                              </button>
                              <p className="text-sm text-gray-600 mt-1">Số lượng: {line.quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-gray-900">{formatPrice(line.unitPrice)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-3">
                          <Wallet className="w-5 h-5 text-[#b8465f] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Thanh toán</p>
                            <p className="text-sm text-gray-600">
                              Đã thanh toán:{' '}
                              <span className="font-medium text-emerald-700">
                                {formatPrice(paidAmount)}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Còn lại:{' '}
                              <span
                                className={`font-medium ${
                                  remainingAmount > 0 ? 'text-amber-700' : 'text-gray-700'
                                }`}
                              >
                                {formatPrice(remainingAmount)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {rentalSchedule ? (
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#b8465f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Lịch thuê</p>
                              <p className="text-sm text-gray-600">{rentalSchedule}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#b8465f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Thời gian đặt</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        )}

                        {order.venue ? (
                          <div className="flex items-start gap-3 md:col-span-2">
                            <MapPin className="w-5 h-5 text-[#b8465f] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Nhận hàng</p>
                              <p className="text-sm text-gray-600">{order.venue}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-3 sm:flex-row">
                        {showDepositPay ? (
                          <button
                            type="button"
                            onClick={() => setPaymentDialog({ order, mode: 'deposit' })}
                            className="flex-1 bg-[#b8465f] text-white py-2.5 px-4 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
                          >
                            Thanh toán đặt cọc
                          </button>
                        ) : null}
                        {showRemainingPay ? (
                          <button
                            type="button"
                            onClick={() => setPaymentDialog({ order, mode: 'remaining' })}
                            className="flex-1 bg-[#b8465f] text-white py-2.5 px-4 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
                          >
                            Thanh toán
                          </button>
                        ) : null}
                        <button
                          onClick={() => router.push(`/my-orders/${order.orderNumber}`)}
                          className="flex-1 border border-[#b8465f] text-[#b8465f] py-2.5 px-4 rounded-lg hover:bg-rose-50 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          Xem chi tiết <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <OrderPaymentDialog
        open={Boolean(paymentDialog)}
        onOpenChange={(open) => {
          if (!open) setPaymentDialog(null);
        }}
        mode={paymentDialog?.mode || 'deposit'}
        orderNumber={paymentDialog?.order.orderNumber || ''}
        orderTotal={paymentDialog?.order.total || 0}
        remainingAmount={paymentDialog ? getRemainingAmount(paymentDialog.order) : 0}
      />
    </div>
  );
};

export default MyOrders;
