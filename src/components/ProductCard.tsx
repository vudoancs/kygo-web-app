'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { language, t } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  return (
    <div className="group bg-white rounded-sm overflow-hidden hover:shadow-lg transition-all relative">
      <Link href={`/product/${product.id}`} className="block relative">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* NEW Badge */}
        {product.badge === 'new' && (
          <div className="absolute top-2 lg:top-3 left-2 lg:left-3">
            <span className="bg-emerald-600 text-white text-[10px] lg:text-xs px-2 lg:px-3 py-1 lg:py-1.5 rounded-sm font-medium uppercase">
              NEW
            </span>
          </div>
        )}
        {/* HOT Badge */}
        {product.badge === 'hot' && (
          <div className="absolute top-2 lg:top-3 left-2 lg:left-3">
            <span className="bg-[#FF8C6B] text-white text-[10px] lg:text-xs px-2 lg:px-3 py-1 lg:py-1.5 rounded-sm font-medium uppercase">
              HOT
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-2 lg:top-3 right-2 lg:right-3 w-8 h-8 lg:w-9 lg:h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10"
      >
        <Heart
          className={`w-4 h-4 lg:w-5 lg:h-5 ${
            isWishlisted ? 'fill-[#b8465f] stroke-[#b8465f]' : 'stroke-gray-400'
          }`}
        />
      </button>

      {/* Content */}
      <div className="p-2 lg:p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xs lg:text-sm text-gray-900 mb-2 lg:mb-3 line-clamp-2 min-h-[2rem] lg:min-h-[2.5rem] hover:text-[#b8465f] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-4">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <span className="text-[9px] lg:text-xs text-gray-500">{t('products.buy')}:</span>
            <span className="font-bold text-gray-900 text-xs lg:text-sm">{formatPrice(product.buyPrice)}</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <span className="text-[9px] lg:text-xs text-gray-500">{t('products.rentPerDay')}:</span>
              <span className="font-bold text-[#b8465f] text-xs lg:text-sm">{formatPrice(product.rentPricePerDay)}</span>
            </div>
            <p className="text-[8px] lg:text-[9px] text-gray-500 italic pl-0">
              {t('products.extraDayNote')}
            </p>
          </div>
        </div>

        {/* Promotion Text */}
        <p className="text-[9px] lg:text-[10px] text-[#b8465f] mb-2 lg:mb-3">
          {language === 'vi' ? 'Thuê 0đ khi mua gói ưu đãi' : language === 'en' ? 'Free rental with package deals' : '패키지 구매 시 무료 대여'}
        </p>

        {/* Add to Cart Button */}
        <button
          className="w-full bg-white border border-gray-300 hover:border-[#b8465f] text-gray-700 hover:text-[#b8465f] py-2 lg:py-2.5 rounded-sm transition-all flex items-center justify-center group/btn"
          onClick={() => {
            // Add to cart logic here
            console.log('Add to cart:', product.id);
          }}
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;