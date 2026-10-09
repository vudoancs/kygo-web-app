'use client';

import React from 'react';
import { formatVndPrice, hasPromotionalPrice } from '@/libs/format-price';

type ProductPriceLineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ProductPriceLineProps {
  label?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  promotionEndsAt?: string;
  tone?: 'default' | 'accent';
  size?: ProductPriceLineSize;
  className?: string;
  labelClassName?: string;
  /** Có KM: giá gốc đậm trên dòng nhãn, dòng dưới "{promoLabel}: giá KM". */
  promoLabel?: string;
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

function formatPromotionEnd(value: string): string {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProductPriceLine({
  label,
  price,
  originalPrice,
  discountPercent,
  promotionEndsAt,
  tone = 'default',
  size = 'sm',
  className = '',
  labelClassName = '',
  promoLabel,
}: ProductPriceLineProps) {
  const onSale = hasPromotionalPrice(price, originalPrice);
  const priceClass =
    tone === 'accent'
      ? 'font-bold text-[#b8465f]'
      : 'font-bold text-gray-900';

  const labelClass = `text-gray-500 shrink-0 ${labelClassName || priceSizeClass[size]}`;
  const discountBadge =
    onSale && discountPercent && discountPercent > 0 ? (
      <span className={`font-medium text-[#b8465f] ${originalSizeClass[size]}`}>
        −{discountPercent}%
      </span>
    ) : null;

  if (onSale && promoLabel) {
    // Giá gốc nổi bật trên dòng nhãn, giá khuyến mãi xuống dòng kèm "Chỉ còn:".
    return (
      <div className={`flex flex-col gap-0.5 ${className}`}>
        <div className="flex flex-wrap items-baseline gap-1.5 lg:gap-2">
          {label ? <span className={labelClass}>{label}</span> : null}
          <span className={`font-bold text-gray-900 line-through ${priceSizeClass[size]}`}>
            {formatVndPrice(originalPrice!)}
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-1.5 lg:gap-2">
          <span className={labelClass}>{promoLabel}:</span>
          <span className={`${priceClass} ${priceSizeClass[size]}`}>
            {formatVndPrice(price)}
          </span>
          {discountBadge}
        </div>
        {promotionEndsAt ? (
          <span className="text-[10px] text-gray-500 lg:text-xs">
            KM đến {formatPromotionEnd(promotionEndsAt)}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <div className="flex flex-wrap items-baseline gap-1.5 lg:gap-2">
        {label ? (
          <span className={labelClass}>{label}</span>
        ) : null}
        {onSale ? (
          <span className={`text-gray-400 line-through ${originalSizeClass[size]}`}>
            {formatVndPrice(originalPrice!)}
          </span>
        ) : null}
        <span className={`${priceClass} ${priceSizeClass[size]}`}>
          {formatVndPrice(price)}
        </span>
        {discountBadge}
      </div>
      {onSale && promotionEndsAt ? (
        <span className="text-[10px] text-gray-500 lg:text-xs">
          KM đến {formatPromotionEnd(promotionEndsAt)}
        </span>
      ) : null}
    </div>
  );
}
