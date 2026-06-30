'use client';

import React from 'react';
import { formatVndPrice, hasPromotionalPrice } from '@/libs/format-price';

type ProductPriceLineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ProductPriceLineProps {
  label?: string;
  price: number;
  originalPrice?: number;
  tone?: 'default' | 'accent';
  size?: ProductPriceLineSize;
  className?: string;
  labelClassName?: string;
}

const priceSizeClass: Record<ProductPriceLineSize, string> = {
  xs: 'text-[9px] lg:text-xs',
  sm: 'text-xs',
  md: 'text-sm lg:text-base',
  lg: 'text-lg',
  xl: 'text-xl lg:text-2xl',
};

const originalSizeClass: Record<ProductPriceLineSize, string> = {
  xs: 'text-[8px] lg:text-[10px]',
  sm: 'text-[10px] lg:text-xs',
  md: 'text-xs lg:text-sm',
  lg: 'text-sm lg:text-lg',
  xl: 'text-lg',
};

export function ProductPriceLine({
  label,
  price,
  originalPrice,
  tone = 'default',
  size = 'sm',
  className = '',
  labelClassName = '',
}: ProductPriceLineProps) {
  const onSale = hasPromotionalPrice(price, originalPrice);
  const priceClass =
    tone === 'accent'
      ? 'font-bold text-[#b8465f]'
      : 'font-bold text-gray-900';

  return (
    <div className={`flex flex-wrap items-baseline gap-1.5 lg:gap-2 ${className}`}>
      {label ? (
        <span className={`text-gray-500 shrink-0 ${labelClassName || priceSizeClass[size]}`}>
          {label}
        </span>
      ) : null}
      {onSale ? (
        <span className={`text-gray-400 line-through ${originalSizeClass[size]}`}>
          {formatVndPrice(originalPrice!)}
        </span>
      ) : null}
      <span className={`${priceClass} ${priceSizeClass[size]}`}>
        {formatVndPrice(price)}
      </span>
    </div>
  );
}
