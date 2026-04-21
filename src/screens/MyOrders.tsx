'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, CreditCard, ChevronRight, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useMyOrdersQuery } from '@/hooks/use-orders-query';
import { isPublicApiConfigured } from '@/libs/env';
import type { OrderDto, OrderStatus } from '@/types/order.dto';

const MyOrders = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const [, setSelectedOrder] = useState<OrderDto | null>(null);

  const myOrdersQuery = useMyOrdersQuery();

  const orders = useMemo((): OrderDto[] => {
    if (!isPublicApiConfigured()) return [];
    return myOrdersQuery.data ?? [];
  }, [myOrdersQuery.data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { label: string; color: string }> = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Đã thanh toán', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Hoàn tất', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status];
  };

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
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        getStatusLabel(order.status).color
                      }`}
                    >
                      {getStatusLabel(order.status).label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tổng tiền</p>
                  <p className="font-bold text-lg text-[#b8465f]">{formatPrice(order.total)}</p>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                {/* Products */}
                <div className="space-y-4 mb-6">
                  {order.lines.map((line) => (
                    <div key={`${order.id}-${line.productId}`} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{line.name}</h3>
                        <p className="text-sm text-gray-600">Số lượng: {line.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(line.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-[#b8465f] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Thanh toán</p>
                      <p className="text-sm text-gray-600">Theo thông tin đơn hàng</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#b8465f] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Thời gian</p>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      router.push(`/my-orders/${order.orderNumber}`);
                    }}
                    className="flex-1 border border-[#b8465f] text-[#b8465f] py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Xem chi tiết <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;