'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, CreditCard, MapPin, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';

interface Order {
  id: string;
  type: 'rent' | 'buy';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'completed' | 'cancelled';
  products: {
    id: string;
    name: string;
    image: string;
    size: string;
    price: number;
  }[];
  rentStartDate?: string;
  rentEndDate?: string;
  totalAmount: number;
  deposit?: number;
  createdAt: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: string;
  deliveryAddress?: string;
}

const MyOrders = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const [, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data
  const orders: Order[] = [
    {
      id: 'DH001',
      type: 'rent',
      status: 'confirmed',
      products: [
        {
          id: '1',
          name: 'Đầm Dạ Hội Cao Cấp Đính Đá',
          image: 'https://images.unsplash.com/photo-1768823341746-d1983ff626a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVuaW5nJTIwZ293biUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3Njk1NzUwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          size: 'M',
          price: 850000,
        },
      ],
      rentStartDate: '2025-02-20',
      rentEndDate: '2025-02-22',
      totalAmount: 4550000,
      deposit: 2000000,
      createdAt: '2025-01-25',
      deliveryMethod: 'delivery',
      paymentMethod: 'Thanh toán khi nhận hàng',
      deliveryAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      id: 'DH002',
      type: 'buy',
      products: [
        {
          id: '3',
          name: 'Đầm Dạ Hội Đỏ Quyến Rũ',
          image: 'https://images.unsplash.com/photo-1768609957035-4313c3935440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjByZWQlMjBjYXJwZXQlMjBnb3dufGVufDF8fHx8MTc2OTU3NTAxMXww&ixlib=rb-4.1.0&q=80&w=1080',
          size: 'S',
          price: 7500000,
        },
      ],
      totalAmount: 7500000,
      createdAt: '2025-01-15',
      status: 'completed',
      deliveryMethod: 'pickup',
      paymentMethod: 'Chuyển khoản ngân hàng',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Đã nhận hàng', color: 'bg-green-100 text-green-800' },
      returned: { label: 'Đã trả', color: 'bg-teal-100 text-teal-800' },
      completed: { label: 'Hoàn tất', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || statusMap.pending;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        <p className="text-gray-600 mt-2">Quản lý đơn hàng và theo dõi lịch thuê</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h2>
          <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào</p>
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
                    <p className="font-semibold text-gray-900">{order.id}</p>
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
                  <p className="font-bold text-lg text-[#b8465f]">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                {/* Products */}
                <div className="space-y-4 mb-6">
                  {order.products.map((product) => (
                    <div key={product.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600">Size: {product.size}</p>
                        <div className="mt-2">
                          {order.type === 'rent' ? (
                            <span className="inline-block bg-rose-100 text-[#b8465f] text-xs px-3 py-1 rounded-full font-medium">
                              Thuê
                            </span>
                          ) : (
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                              Mua
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  {/* Rental Dates */}
                  {order.type === 'rent' && order.rentStartDate && order.rentEndDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#b8465f] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lịch thuê</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.rentStartDate).toLocaleDateString('vi-VN')} -{' '}
                          {new Date(order.rentEndDate).toLocaleDateString('vi-VN')}
                        </p>
                        {order.deposit && (
                          <p className="text-xs text-gray-500 mt-1">Tiền cọc: {formatPrice(order.deposit)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-[#b8465f] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Thanh toán</p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#b8465f] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.deliveryMethod === 'delivery' ? 'Giao hàng' : 'Nhận tại showroom'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress || '33 Mỹ An 23, Phường Ngũ Hành Sơn, Tp Đà Nẵng'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 border border-[#b8465f] text-[#b8465f] py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Xem chi tiết <ChevronRight className="w-4 h-4" />
                  </button>
                  {order.status === 'pending' && (
                    <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Hủy đơn
                    </button>
                  )}
                  {order.type === 'buy' && order.status === 'delivered' && (
                    <button className="flex-1 bg-[#b8465f] text-white py-2 px-4 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium">
                      Đánh giá
                    </button>
                  )}
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