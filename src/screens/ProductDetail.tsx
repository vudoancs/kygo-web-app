'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart, Share2, AlertCircle } from 'lucide-react';
import type { Product } from '../data/products';
import { products } from '../data/products';
import { useAppContext } from '@/modules/app-state';
import RentalCalendar from '../components/RentalCalendar';
import { useLanguage } from '../contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductDetailQuery } from '@/hooks/use-products-query';
import { isPublicApiConfigured } from '@/libs/env';
import { productFromDto } from '@/modules/product';

const ProductDetail = () => {
  const params = useParams();
  const id = (params?.id as string) ?? '';
  const router = useRouter();
  const { addToCart } = useAppContext();
  const { language, t } = useLanguage();

  const mockProduct = useMemo(() => products.find((p) => p.id === id), [id]);
  const detailQuery = useProductDetailQuery(id);

  const product = useMemo((): Product | null => {
    if (!isPublicApiConfigured()) {
      return mockProduct ?? null;
    }
    if (detailQuery.isSuccess && detailQuery.data) {
      return productFromDto(detailQuery.data);
    }
    if (detailQuery.isError || detailQuery.isPending) {
      return mockProduct ?? null;
    }
    return mockProduct ?? null;
  }, [
    mockProduct,
    detailQuery.data,
    detailQuery.isError,
    detailQuery.isPending,
    detailQuery.isSuccess,
  ]);

  const apiLoading =
    isPublicApiConfigured() && detailQuery.isPending && !mockProduct;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [rentStartDate, setRentStartDate] = useState<Date | null>(new Date()); // Mặc định hôm nay
  const [rentDuration, setRentDuration] = useState(3);
  const [customDuration, setCustomDuration] = useState('');
  const [actionType, setActionType] = useState<'rent' | 'buy'>('rent');
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes[0] ?? '');
    setSelectedColor(product.colors[0] ?? '');
    setCurrentImageIndex(0);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- chỉ reset khi đổi sản phẩm

  if (apiLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-[75%]" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
        {isPublicApiConfigured() && detailQuery.isError ? (
          <p className="mt-2 text-sm text-amber-700">
            Không tải được dữ liệu từ máy chủ. Kiểm tra API hoặc mã sản phẩm.
          </p>
        ) : null}
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateRentalTotal = () => {
    if (!rentStartDate || actionType !== 'rent') return 0;
    
    const FIXED_DEPOSIT = 500000; // Tiền cọc cố định
    let rentalPrice = product.rentPricePerDay; // Giá cho ngày đầu tiên
    
    // Từ ngày 2 trở đi, tính thêm 10%/ngày
    if (rentDuration > 1) {
      const extraDays = rentDuration - 1;
      const extraFee = product.rentPricePerDay * 0.1 * extraDays;
      rentalPrice += extraFee;
    }
    
    return rentalPrice + FIXED_DEPOSIT;
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(language === 'vi' ? 'Vui lòng chọn size và màu sắc' : language === 'en' ? 'Please select size and color' : '사이즈와 색상을 선택해주세요');
      return;
    }

    if (actionType === 'rent' && (!rentStartDate || rentDuration <= 0)) {
      alert(language === 'vi' ? 'Vui lòng chọn ngày bắt đầu và số ngày thuê' : language === 'en' ? 'Please select start date and duration' : '대여 시작일과 기간을 선택해주세요');
      return;
    }

    const FIXED_DEPOSIT = 500000;
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      type: actionType,
      name: product.name,
      image: product.image,
      size: selectedSize,
      price: actionType === 'buy' ? product.buyPrice : calculateRentalTotal() - FIXED_DEPOSIT,
      ...(actionType === 'rent' && {
        rentStartDate: rentStartDate?.toISOString(),
        rentDuration: rentDuration,
        deposit: FIXED_DEPOSIT,
      }),
    };

    addToCart(cartItem);
    router.push('/cart');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#b8465f]">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-[#b8465f]">
          Sản phẩm
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {isPublicApiConfigured() && detailQuery.isError && mockProduct?.id === product.id ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Đang hiển thị dữ liệu mẫu — không lấy được chi tiết từ API.
        </p>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-[#b8465f]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="space-y-1">
                <p className="text-gray-600">{t('productDetail.brand')}: {product.brand}</p>
                {product.productCode && (
                  <p className="text-gray-600">{t('productDetail.productCode')}: <span className="font-medium text-gray-900">{product.productCode}</span></p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#b8465f] hover:text-[#b8465f] transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#b8465f] hover:text-[#b8465f] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setActionType('rent')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  actionType === 'rent'
                    ? 'bg-[#b8465f] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#b8465f]'
                }`}
              >
                {t('productDetail.rentDress')}
              </button>
              <button
                onClick={() => setActionType('buy')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  actionType === 'buy'
                    ? 'bg-[#b8465f] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#b8465f]'
                }`}
              >
                {t('productDetail.buyDress')}
              </button>
            </div>

            {actionType === 'rent' ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-600">{t('products.rentPerDay')}:</span>
                    <div className="flex items-baseline gap-2">
                      {product.originalRentPriceDanang && (
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(product.originalRentPriceDanang)}
                        </span>
                      )}
                      <span className="font-semibold text-[#b8465f] text-xl">
                        {formatPrice(product.rentPricePerDay)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    <span className="font-bold">{t('products.extraDayNote')}</span>
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('products.depositInfo')}:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(500000)}</span>
                </div>
                
                <div className="pt-2 pb-2 border-t border-gray-200">
                  <p className="text-xs text-[#b8465f] italic">
                    {language === 'vi' 
                      ? '✨ Ưu đãi cho các khách hàng thân thiết, đối tác liên hệ.'
                      : language === 'en'
                      ? '✨ Special offers for loyal customers and partners, please contact us.'
                      : '✨ 단골 고객 및 파트너를 위한 특별 혜택은 문의해 주세요.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600">Giá bán:</span>
                  <div className="flex items-baseline gap-2">
                    {product.originalBuyPrice && (
                      <span className="text-gray-400 line-through text-lg">
                        {formatPrice(product.originalBuyPrice)}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 text-2xl">
                      {formatPrice(product.buyPrice)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-[#b8465f] italic">
                    {language === 'vi' 
                      ? '✨ Ưu đãi cho các khách hàng thân thiết, đối tác liên hệ.'
                      : language === 'en'
                      ? '✨ Special offers for loyal customers and partners, please contact us.'
                      : '✨ 단골 고객 및 파트너를 위한 특별 혜택은 문의해 주세요.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-900 mb-3">{t('productDetail.selectSize')}</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-[#b8465f] text-white border-[#b8465f]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#b8465f]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-900 mb-3">{t('productDetail.selectColor')}</label>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                    selectedColor === color
                      ? 'bg-[#b8465f] text-white border-[#b8465f]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#b8465f]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Rental Date Selection */}
          {actionType === 'rent' && (
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-3">{t('products.selectStartDate')}</label>
              <RentalCalendar
                unavailableDates={product.unavailableDates || []}
                onDateSelect={setRentStartDate}
                selectedDate={rentStartDate}
              />

              {rentStartDate && (
                <div className="mt-4">
                  <label className="block font-semibold text-gray-900 mb-3">
                    {language === 'vi' ? 'Số ngày thuê' : language === 'en' ? 'Rental Duration' : '대여 기간'}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[1, 2, 3].map((days) => (
                      <button
                        key={days}
                        onClick={() => {
                          setRentDuration(days);
                          setCustomDuration('');
                        }}
                        className={`flex-1 min-w-[80px] py-2 px-4 border rounded-lg font-medium transition-colors ${
                          rentDuration === days && !customDuration
                            ? 'bg-[#b8465f] text-white border-[#b8465f]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#b8465f]'
                        }`}
                      >
                        {days} {language === 'vi' ? 'ngày' : language === 'en' ? 'day' + (days > 1 ? 's' : '') : '일'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder={language === 'vi' ? 'Hoặc nhập số ngày khác...' : language === 'en' ? 'Or enter custom days...' : '또는 사용자 지정 일수 입력...'}
                      value={customDuration}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomDuration(value);
                        const numValue = parseInt(value);
                        if (numValue > 0) {
                          setRentDuration(numValue);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8465f]/20 focus:border-[#b8465f]"
                    />
                    <span className="text-sm text-gray-500">{language === 'vi' ? 'ngày' : language === 'en' ? 'days' : '일'}</span>
                  </div>
                  
                  {rentDuration > 0 && (
                    <div className="mt-3 p-4 bg-rose-50 rounded-lg space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{t('products.rentalPeriod')}:</span>
                        <span className="text-gray-900 font-semibold">{rentDuration} {t('common.days')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{t('products.pickupDate')}:</span>
                        <span className="text-gray-900 font-semibold">
                          10:00 - {rentStartDate.toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{t('products.returnDate')}:</span>
                        <span className="text-gray-900 font-semibold">
                          10:00 - {new Date(rentStartDate.getTime() + rentDuration * 24 * 60 * 60 * 1000).toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'ko-KR'
                          )}
                        </span>
                      </div>
                      <div className="pt-2.5 border-t border-rose-200 space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 font-medium">{t('products.totalRentalFee')}:</span>
                          <span className="text-[#b8465f] font-bold">
                            {formatPrice(calculateRentalTotal() - 500000)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 font-medium">{t('products.depositFee')}:</span>
                          <span className="text-gray-900 font-semibold">
                            {formatPrice(500000)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {product.unavailableDates && product.unavailableDates.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">
                      {language === 'vi' ? 'Lưu ý:' : language === 'en' ? 'Note:' : '주의:'}
                    </p>
                    <p>
                      {language === 'vi' 
                        ? 'Một số ngày đã được đặt trước. Vui lòng chọn ngày khác hoặc liên hệ để được tư vấn.'
                        : language === 'en'
                        ? 'Some dates are already booked. Please select different dates or contact us for assistance.'
                        : '일부 날짜는 이미 예약되었습니다. 다른 날짜를 선택하거나 상담을 위해 문의하세요.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#b8465f] hover:bg-[#9d3a50] text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors mb-4"
          >
            {actionType === 'rent' ? t('productDetail.rentNow') : t('productDetail.buyNow')}
          </button>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">{t('productDetail.description')}</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500">{t('productDetail.category')}</p>
                <p className="font-medium text-gray-900">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('productDetail.occasions')}</p>
                <p className="font-medium text-gray-900">{product.occasion.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('productDetail.style')}</p>
                <p className="font-medium text-gray-900">{product.style.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 border-t border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 font-semibold uppercase tracking-wider text-sm transition-colors relative ${
              activeTab === 'info'
                ? 'text-gray-900 border-b-2 border-[#b8465f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('productDetail.additionalInfo')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 font-semibold uppercase tracking-wider text-sm transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-gray-900 border-b-2 border-[#b8465f]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('productDetail.reviewsCount')}
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'info' ? (
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 uppercase text-sm">
                      {t('productDetail.occasions')}
                    </span>
                    <span className="text-gray-600 text-right flex-1 ml-4">
                      {product.occasion.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 uppercase text-sm">
                      {t('productDetail.style')}
                    </span>
                    <span className="text-gray-600 text-right flex-1 ml-4">
                      {product.style.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 uppercase text-sm">SIZE</span>
                    <span className="text-gray-600 text-right flex-1 ml-4">
                      {product.sizes.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 uppercase text-sm">
                      {t('productDetail.color')}
                    </span>
                    <span className="text-gray-600 text-right flex-1 ml-4">
                      {product.colors.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl">
              <p className="text-gray-500 italic">
                {language === 'vi' 
                  ? 'Chưa có đánh giá nào cho sản phẩm này.'
                  : language === 'en'
                  ? 'No reviews yet for this product.'
                  : '이 제품에 대한 리뷰가 아직 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-16">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8 uppercase">
          {t('productDetail.similarProducts')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter(p => 
              p.id !== product.id && 
              (p.category === product.category || 
               p.occasion.some(occ => product.occasion.includes(occ)) ||
               p.style.some(st => product.style.includes(st)))
            )
            .slice(0, 4)
            .map((similarProduct) => (
              <Link
                key={similarProduct.id}
                href={`/product/${similarProduct.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={similarProduct.image}
                    alt={similarProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {similarProduct.badge && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
                        similarProduct.badge === 'new' ? 'bg-green-500' :
                        similarProduct.badge === 'sale' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}>
                        {similarProduct.badge.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-[#b8465f] transition-colors">
                  {similarProduct.name}
                </h3>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    {similarProduct.originalBuyPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(similarProduct.originalBuyPrice)}
                      </span>
                    )}
                    <span className="font-bold text-gray-900">
                      {formatPrice(similarProduct.buyPrice)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-[#b8465f]">
                      {formatPrice(similarProduct.rentPricePerDay)}
                    </span>
                    <span className="text-gray-500">{t('common.perDay')}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;