'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardMobileProps {
  product: Product;
}

const ProductCardMobile: React.FC<ProductCardMobileProps> = ({ product }) => {
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const formatPriceRange = (minPrice: number, maxPrice: number) => {
    return `${new Intl.NumberFormat('vi-VN').format(minPrice)} đ - ${new Intl.NumberFormat('vi-VN').format(maxPrice)} đ`;
  };

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="flex-shrink-0 w-[200px] block"
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Name */}
      <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
        {product.name}
      </h3>

      {product.productCode ? (
        <p className="text-[10px] text-gray-500 mb-2">
          {t('productDetail.productCode')}:{' '}
          <span className="font-medium text-gray-700">{product.productCode.slice(0, 5)}</span>
        </p>
      ) : null}

      {/* Buy Price Range */}
      <div className="mb-1">
        {product.originalBuyPrice ? (
          <div className="text-xs text-gray-700">
            <span className="font-medium">{t('products.buy')}: </span>
            {formatPriceRange(product.buyPrice, product.originalBuyPrice)}
          </div>
        ) : (
          <div className="text-xs text-gray-700">
            <span className="font-medium">{t('products.buy')}: </span>
            {formatPrice(product.buyPrice)}
          </div>
        )}
      </div>

      {/* Rental Price */}
      <div className="mb-2">
        {product.rentByTime ? (
          <div className="text-xs text-gray-700">
            <span className="font-medium">{t('products.rentPerTime')}: </span>
            {formatPrice(product.rentPricePerDay)}
          </div>
        ) : (
          <div className="text-xs text-gray-700">
            <span className="font-medium">{t('products.rentPerTime')}: </span>
            {formatPriceRange(
              product.rentPriceDanang ?? product.rentPricePerDay,
              product.rentPriceProvince ?? product.rentPricePerDay,
            )}
          </div>
        )}
      </div>

      {/* Promotion Text */}
      <p className="text-[10px] text-[#b8465f]">
        Thuê 0đ khi mua Gói Ưu Đãi
      </p>
    </Link>
  );
};

export default ProductCardMobile;