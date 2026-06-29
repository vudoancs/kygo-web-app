'use client';

import React, { useState } from 'react';
import { DEFAULT_PRODUCT_IMAGE, resolveProductImage } from '@/libs/product-image';

interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

export function ProductImage({ src, alt = '', className, onError, ...rest }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = failed ? DEFAULT_PRODUCT_IMAGE : resolveProductImage(src);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        if (!failed) {
          setFailed(true);
        }
        onError?.(event);
      }}
      {...rest}
    />
  );
}
