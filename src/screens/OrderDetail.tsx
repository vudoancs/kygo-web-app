'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useOrderDetailQuery } from '@/hooks/use-orders-query';
import { isPublicApiConfigured } from '@/libs/env';
import { OrderProductThumb } from '@/components/OrderProductThumb';
import type { OrderDto, OrderKind, OrderLineType } from '@/types/order.dto';

const RAW_STATUS_LABEL: Record<string, string> = {
  PENDING_CONFIRM: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  WAITING_DELIVERY: 'Đã xác nhận',
  DELIVERED: 'Đang thuê',
  RETURNED: 'Đã trả',
  WAITING_REFUND: 'Chờ hoàn cọc',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Hủy',
};

function resolveOrderKind(order: OrderDto): OrderKind {
  if (order.orderKind) return order.orderKind;
  const hasBuy = order.lines.some((l) => l.type === 'buy');
  const hasRent = order.lines.some((l) => l.type !== 'buy');
  if (hasBuy && hasRent) return 'mixed';
  if (hasBuy) return 'buy';
  return 'rent';
}

function resolveLineType(type: OrderLineType | undefined, orderKind: OrderKind): OrderLineType {
  if (type === 'buy' || type === 'rent') return type;
  return orderKind === 'buy' ? 'buy' : 'rent';
}

function orderKindMeta(kind: OrderKind): { label: string; className: string } {
  if (kind === 'buy') {
    return { label: 'Đơn mua', className: 'bg-sky-100 text-sky-800' };
  }
  if (kind === 'mixed') {
    return { label: 'Thuê + Mua', className: 'bg-violet-100 text-violet-800' };
  }
  return { label: 'Đơn thuê', className: 'bg-amber-100 text-amber-800' };
}

function lineTypeMeta(type: OrderLineType): { label: string; className: string } {
  if (type === 'buy') {
    return { label: 'Mua', className: 'bg-sky-50 text-sky-700 border-sky-200' };
  }
  return { label: 'Thuê', className: 'bg-amber-50 text-amber-800 border-amber-200' };
}

const OrderDetail = () => {
  const params = useParams();
  const id = (params?.id as string) ?? '';
  const router = useRouter();
  const { user } = useAppContext();

  const orderQuery = useOrderDetailQuery(id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const statusLabel = (() => {
    const raw = String(orderQuery.data?.rawStatus || '').toUpperCase();
    if (raw && RAW_STATUS_LABEL[raw]) return RAW_STATUS_LABEL[raw];
    return orderQuery.data?.status || '—';
  })();

  if (!user) {
    router.push(`/login?redirect=/my-orders/${encodeURIComponent(id || '')}`);
    return null;
  }

  if (!isPublicApiConfigured()) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Chưa cấu hình API</p>
              <p className="text-sm text-gray-600 mt-1">Không thể tải chi tiết đơn hàng.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push('/my-orders')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#b8465f]"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {orderQuery.isPending ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      ) : orderQuery.isError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Không tải được chi tiết đơn hàng</p>
              <p className="text-sm text-gray-600 mt-1">Vui lòng thử lại.</p>
              <button
                type="button"
                onClick={() => orderQuery.refetch()}
                className="mt-4 bg-[#b8465f] text-white px-5 py-2 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
              >
                Tải lại
              </button>
            </div>
          </div>
        </div>
      ) : !orderQuery.data ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Không tìm thấy đơn hàng.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h1 className="font-serif text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(() => {
                const kindMeta = orderKindMeta(resolveOrderKind(orderQuery.data));
                return (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${kindMeta.className}`}
                  >
                    {kindMeta.label}
                  </span>
                );
              })()}
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {statusLabel}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>
                Mã đơn: <span className="font-semibold text-gray-900">{orderQuery.data.orderNumber}</span>
              </span>
              <span>
                Ngày tạo:{' '}
                <span className="font-semibold text-gray-900">
                  {new Date(orderQuery.data.createdAt).toLocaleString('vi-VN')}
                </span>
              </span>
            </div>
          </div>

          <div className="p-6">
            {(() => {
              const kind = resolveOrderKind(orderQuery.data);
              const showRental =
                kind !== 'buy' &&
                Boolean(orderQuery.data.rentalStartDate || orderQuery.data.rentalEndDate);
              if (showRental) {
                return (
                  <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <span>
                        Lịch thuê:{' '}
                        <span className="font-semibold text-gray-900">
                          Nhận {orderQuery.data.pickupTime || '12:00'}{' '}
                          {orderQuery.data.rentalStartDate
                            ? new Date(orderQuery.data.rentalStartDate).toLocaleDateString('vi-VN')
                            : '—'}{' '}
                          · Trả {orderQuery.data.returnTime || '12:00'}{' '}
                          {orderQuery.data.rentalEndDate
                            ? new Date(orderQuery.data.rentalEndDate).toLocaleDateString('vi-VN')
                            : '—'}
                        </span>
                      </span>
                      {orderQuery.data.venue ? (
                        <span>
                          Địa điểm:{' '}
                          <span className="font-semibold text-gray-900">{orderQuery.data.venue}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              }
              if (orderQuery.data.venue) {
                return (
                  <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    Địa điểm:{' '}
                    <span className="font-semibold text-gray-900">{orderQuery.data.venue}</span>
                  </div>
                );
              }
              return null;
            })()}

            <h2 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm</h2>
            <div className="space-y-4">
              {orderQuery.data.lines.map((line) => {
                const kind = resolveOrderKind(orderQuery.data);
                const lineType = resolveLineType(line.type, kind);
                const lineMeta = lineTypeMeta(lineType);
                return (
                  <div key={line.productId} className="flex items-start gap-4">
                    <OrderProductThumb
                      productId={line.productId}
                      name={line.name}
                      images={line.images}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
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
                        <span
                          className={`inline-flex rounded border px-1.5 py-0.5 text-[11px] font-medium ${lineMeta.className}`}
                        >
                          {lineMeta.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Số lượng: {line.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(line.unitPrice)}</p>
                      <p className="text-sm text-gray-600">
                        Thành tiền:{' '}
                        {formatPrice(
                          line.lineTotal != null
                            ? line.lineTotal
                            : line.unitPrice * line.quantity,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng thanh toán</span>
                <span className="text-lg font-bold text-[#b8465f]">
                  {formatPrice(orderQuery.data.total)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Đã thanh toán</span>
                <span className="font-semibold text-emerald-700">
                  {formatPrice(Number(orderQuery.data.paidAmount ?? 0))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Còn lại</span>
                <span
                  className={`font-semibold ${
                    Number(
                      orderQuery.data.remainingAmount ??
                        Math.max(0, orderQuery.data.total - Number(orderQuery.data.paidAmount ?? 0)),
                    ) > 0
                      ? 'text-amber-700'
                      : 'text-gray-700'
                  }`}
                >
                  {formatPrice(
                    Number(
                      orderQuery.data.remainingAmount ??
                        Math.max(0, orderQuery.data.total - Number(orderQuery.data.paidAmount ?? 0)),
                    ),
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
