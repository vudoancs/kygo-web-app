'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, Building2, MapPin, User as UserIcon } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';

const Checkout = () => {
  const { cart, user, clearCart } = useAppContext();
  const router = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer' | 'online'>('cod');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    notes: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart.length, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateDeposit = () => {
    return cart.reduce((sum, item) => sum + (item.deposit || 0), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeposit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // In a real app, this would submit to an API
    alert('Đặt hàng thành công! Cảm ơn bạn đã tin tưởng Kygo Prom.');
    clearCart();
    router.push('/my-orders');
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <UserIcon className="w-8 h-8 text-[#b8465f]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tiếp tục đặt hàng</p>
          <button
            onClick={() => router.push('/login?redirect=/checkout')}
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
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Hình thức nhận hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    deliveryMethod === 'delivery'
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className={`w-5 h-5 ${deliveryMethod === 'delivery' ? 'text-[#b8465f]' : 'text-gray-400'}`} />
                    <span className="font-semibold">Giao hàng tận nơi</span>
                  </div>
                  <p className="text-sm text-gray-600">Miễn phí giao hàng nội thành</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className={`w-5 h-5 ${deliveryMethod === 'pickup' ? 'text-[#b8465f]' : 'text-gray-400'}`} />
                    <span className="font-semibold">Nhận tại showroom</span>
                  </div>
                  <p className="text-sm text-gray-600">33 Mỹ An 23, Phường Ngũ Hành Sơn, Tp Đà Nẵng</p>
                </button>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required={deliveryMethod === 'delivery'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required={deliveryMethod === 'delivery'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required={deliveryMethod === 'delivery'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#b8465f]' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                      <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    paymentMethod === 'transfer'
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-5 h-5 ${paymentMethod === 'transfer' ? 'text-[#b8465f]' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold">Chuyển khoản ngân hàng</div>
                      <p className="text-sm text-gray-600">Chuyển khoản qua tài khoản ngân hàng</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    paymentMethod === 'online'
                      ? 'border-[#b8465f] bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'online' ? 'text-[#b8465f]' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold">Thanh toán online</div>
                      <p className="text-sm text-gray-600">VNPay, MoMo, thẻ quốc tế</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Ghi chú</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Ghi chú về đơn hàng (tùy chọn)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Đơn hàng</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{formatPrice(calculateSubtotal())}</span>
                </div>
                {calculateDeposit() > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tiền cọc</span>
                    <span className="font-medium text-gray-900">{formatPrice(calculateDeposit())}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Tổng cộng</span>
                <span className="text-[#b8465f]">{formatPrice(calculateTotal())}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;