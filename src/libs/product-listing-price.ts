import type { Product } from '@/data/products';

export type ProductListingFilterMode = 'all' | 'rent' | 'buy';

/** Giá dùng lọc/sort trên listing — khớp giá hiển thị trên card (KM nếu có). */
export function getListingDisplayPrice(
  product: Product,
  filterType: ProductListingFilterMode,
): number {
  if (filterType === 'buy') {
    return product.buyPrice;
  }
  return product.rentPricePerDay;
}
