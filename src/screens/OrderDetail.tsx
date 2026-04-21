'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Package } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useOrderDetailQuery } from '@/hooks/use-orders-query';
import { isPublicApiConfigured } from '@/libs/env';

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
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>
                Mã đơn: <span className="font-semibold text-gray-900">{orderQuery.data.id}</span>
              </span>
              <span>
                Trạng thái: <span className="font-semibold text-gray-900">{orderQuery.data.status}</span>
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
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm</h2>
            <div className="space-y-4">
              {orderQuery.data.lines.map((line) => (
                <div key={line.productId} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{line.name}</p>
                    <p className="text-sm text-gray-600">Số lượng: {line.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(line.unitPrice)}</p>
                    <p className="text-sm text-gray-600">
                      Thành tiền: {formatPrice(line.unitPrice * line.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng thanh toán</span>
              <span className="text-lg font-bold text-[#b8465f]">{formatPrice(orderQuery.data.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;

