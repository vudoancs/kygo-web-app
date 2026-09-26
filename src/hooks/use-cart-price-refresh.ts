'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { isPublicApiConfigured } from '@/libs/env';
import { useAppContext } from '@/modules/app-state';
import { productFromDto } from '@/modules/product';
import { rentCartPricing } from '@/modules/product/lib/rent-cart-price';
import { fetchProductById } from '@/services/products.service';
import { productKeys } from '@/hooks/use-products-query';

/**
 * Làm mới giá dòng thuê trong giỏ theo giá hiệu lực hiện tại từ API
 * (giảm giá thuê có thể bắt đầu/kết thúc sau khi khách thêm vào giỏ).
 * Trả `changedCount` > 0 khi có dòng đã cập nhật giá để UI thông báo.
 */
export function useCartPriceRefresh() {
  const { cart, updateCartItem } = useAppContext();
  const [changedCount, setChangedCount] = useState(0);

  const rentProductIds = useMemo(
    () => [...new Set(cart.filter((i) => i.type === 'rent').map((i) => i.productId))],
    [cart],
  );

  const results = useQueries({
    queries: rentProductIds.map((id) => ({
      queryKey: productKeys.detail(id),
      queryFn: () => fetchProductById(id),
      enabled: isPublicApiConfigured(),
      refetchOnMount: 'always' as const,
      retry: 1,
    })),
  });

  const pricingByProductId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof productFromDto>>();
    results.forEach((r, i) => {
      if (r.data) map.set(rentProductIds[i], productFromDto(r.data));
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ phụ thuộc dữ liệu đã tải
  }, [results.map((r) => r.dataUpdatedAt).join('|'), rentProductIds]);

  useEffect(() => {
    let changed = 0;
    for (const item of cart) {
      if (item.type !== 'rent') continue;
      const product = pricingByProductId.get(item.productId);
      if (!product) continue;
      const next = rentCartPricing(product, item.rentDuration ?? 3);
      if (
        next.price !== item.price ||
        next.originalPrice !== item.originalPrice ||
        next.discountPercent !== item.discountPercent
      ) {
        changed += 1;
        updateCartItem(item.id, {
          price: next.price,
          originalPrice: next.originalPrice,
          discountPercent: next.discountPercent,
        });
      }
    }
    if (changed > 0) setChangedCount((n) => n + changed);
    // `cart` cố ý không nằm trong deps: chỉ đồng bộ khi dữ liệu giá mới về (tránh vòng lặp cập nhật).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricingByProductId]);

  return {
    isRefreshing: results.some((r) => r.isFetching),
    changedCount,
  };
}
