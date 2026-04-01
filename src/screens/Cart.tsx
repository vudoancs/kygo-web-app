'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAppContext } from '@/modules/app-state';
import { useLanguage } from '../contexts/LanguageContext';

const Cart = () => {
  const { cart, removeFromCart } = useAppContext();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [depositMethod, setDepositMethod] = useState<'cash' | 'id'>('cash');
  const [discountCode, setDiscountCode] = useState('');

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
    const subtotal = calculateSubtotal();
    const deposit = depositMethod === 'cash' ? calculateDeposit() : 0;
    return subtotal + deposit;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link
            href="/products"
            className="inline-block bg-[#b8465f] text-white px-8 py-3 rounded-lg hover:bg-[#9d3a50] transition-colors font-medium"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
              {/* Product Image */}
              <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <div className="mt-2">
                      {item.type === 'rent' ? (
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
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Rental Dates */}
                {item.type === 'rent' && item.rentStartDate && item.rentDuration && (() => {
                  const startDate = new Date(item.rentStartDate);
                  const duration = item.rentDuration;
                  const pickupTime = '10:00';
                  const returnTime = '10:00'; // Luôn trả vào 10:00
                  const returnDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000); // Ngày trả = ngày nhận + số ngày
                  
                  return (
                    <div className="mt-3 p-3 bg-rose-50 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">{t('cart.rentalPeriod')}:</span>
                        <span className="text-gray-900 font-semibold">{duration} {t('common.days')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">{t('cart.pickupTime')}:</span>
                        <span className="text-gray-900 font-semibold">
                          {pickupTime} - {startDate.toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">{t('cart.returnTime')}:</span>
                        <span className="text-gray-900 font-semibold">
                          {returnTime} - {returnDate.toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm text-gray-600">
                    {item.type === 'rent' ? 'Giá thuê:' : 'Giá:'}
                  </span>
                  <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                </div>
                {item.type === 'rent' && item.deposit && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-600">Tiền cọc:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(item.deposit)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">{t('cart.orderSummary')}</h2>

            {/* Discount Code Section */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('cart.discountCode')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder={language === 'vi' ? 'Nhập mã giảm giá' : language === 'en' ? 'Enter discount code' : '할인 코드 입력'}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f] text-sm"
                />
                <button
                  className="px-4 py-2 bg-[#b8465f] text-white rounded-lg hover:bg-[#9d3a50] transition-colors text-sm font-medium"
                >
                  {t('cart.apply')}
                </button>
              </div>
            </div>

            {/* Deposit Method Selection (only show if there are rental items) */}
            {calculateDeposit() > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('cart.depositMethod')}</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[#b8465f] transition-colors">
                    <input
                      type="radio"
                      name="depositMethod"
                      value="cash"
                      checked={depositMethod === 'cash'}
                      onChange={() => setDepositMethod('cash')}
                      className="w-4 h-4 text-[#b8465f] focus:ring-[#b8465f]"
                    />
                    <span className="ml-3 text-sm text-gray-900">{t('cart.cashDeposit')}</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[#b8465f] transition-colors">
                    <input
                      type="radio"
                      name="depositMethod"
                      value="id"
                      checked={depositMethod === 'id'}
                      onChange={() => setDepositMethod('id')}
                      className="w-4 h-4 text-[#b8465f] focus:ring-[#b8465f]"
                    />
                    <span className="ml-3 text-sm text-gray-900">{t('cart.idCardDeposit')}</span>
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium text-gray-900">{formatPrice(calculateSubtotal())}</span>
              </div>
              {calculateDeposit() > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.depositFee')}</span>
                  <span className="font-medium text-gray-900">
                    {depositMethod === 'cash' ? formatPrice(calculateDeposit()) : (
                      <span className="text-green-600 text-sm">{language === 'vi' ? 'Giấy tờ tùy thân' : language === 'en' ? 'ID card' : '신분증'}</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>{t('cart.total')}</span>
              <span className="text-[#b8465f]">{formatPrice(calculateTotal())}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-3 px-6 rounded-lg font-semibold transition-colors mb-3"
            >
              Tiến hành thanh toán
            </button>

            <Link
              href="/products"
              className="block text-center text-[#b8465f] hover:underline text-sm"
            >
              Tiếp tục mua sắm
            </Link>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Miễn phí vận chuyển nội thành</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Hoàn tiền cọc trong 48h sau khi trả váy</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Hỗ trợ đổi size miễn phí</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;