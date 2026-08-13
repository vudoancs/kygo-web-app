'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { resolveProductImages } from '@/libs/product-image';

type OrderProductThumbProps = {
  productId: string;
  name: string;
  images?: string[];
};

export function OrderProductThumb({ productId, name, images }: OrderProductThumbProps) {
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = resolveProductImages(images);
  const hasRealImages = Boolean(images?.some((img) => Boolean(img?.trim())));

  const openProduct = () => {
    if (!productId) return;
    window.open(`/product/${encodeURIComponent(productId)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActiveIndex(0);
      }}
    >
      <button
        type="button"
        onClick={openProduct}
        className="group relative block h-24 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 text-left transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#b8465f]/30"
        title="Xem chi tiết sản phẩm"
      >
        {hasRealImages ? (
          <ProductImage
            src={gallery[0]}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </button>

      {hovered && hasRealImages ? (
        <div className="absolute left-full top-0 z-40 ml-3 hidden w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl md:block">
          <div className="mb-2 overflow-hidden rounded-lg bg-gray-100">
            <ProductImage
              src={gallery[activeIndex] || gallery[0]}
              alt={name}
              className="h-72 w-full object-cover"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((src, index) => (
                <button
                  key={`${productId}-preview-${index}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={`h-12 w-10 flex-shrink-0 overflow-hidden rounded border ${
                    activeIndex === index ? 'border-[#b8465f]' : 'border-gray-200'
                  }`}
                >
                  <ProductImage src={src} alt={`${name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
          <p className="mt-2 line-clamp-2 text-xs text-gray-600">{name}</p>
          <p className="mt-1 text-[11px] text-[#b8465f]">Click ảnh để mở trang sản phẩm</p>
        </div>
      ) : null}
    </div>
  );
}
