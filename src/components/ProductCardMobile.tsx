'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductImage } from './ProductImage';
import { ProductPriceLine } from './ProductPriceLine';

interface ProductCardMobileProps {
  product: Product;
}

const ProductCardMobile: React.FC<ProductCardMobileProps> = ({ product }) => {
  const { t } = useLanguage();
  const originalRentPrice =
    product.originalRentPricePerDay ?? product.originalRentPriceDanang;

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="flex-shrink-0 w-[200px] block"
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
        <ProductImage
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

      <div className="mb-1">
        <ProductPriceLine
          label={`${t('products.buy')}:`}
          price={product.buyPrice}
          originalPrice={product.originalBuyPrice}
          size="sm"
          labelClassName="text-xs text-gray-700 font-medium"
        />
      </div>

      <div className="mb-2">
        <ProductPriceLine
          label={`${t('products.rentPerTime')}:`}
          price={product.rentPricePerDay}
          originalPrice={originalRentPrice}
          tone="accent"
          size="sm"
          labelClassName="text-xs text-gray-700 font-medium"
        />
      </div>

      {/* Promotion Text */}
      <p className="text-[10px] text-[#b8465f]">
        Thuê 0đ khi mua Gói Ưu Đãi
      </p>
    </Link>
  );
};

export default ProductCardMobile;