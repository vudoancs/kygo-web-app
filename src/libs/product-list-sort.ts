import type { FetchProductsParams } from '@/services/products.service';

/** Giá trị `sortBy` trên UI trang danh sách sản phẩm. */
export type ProductListingSortKey =
  | 'code-desc'
  | 'newest'
  | 'popular'
  | 'price-asc'
  | 'price-desc';

export const DEFAULT_PRODUCT_LISTING_SORT: ProductListingSortKey = 'code-desc';

export function mapListingSortToApiParams(
  sortBy: ProductListingSortKey,
): Pick<FetchProductsParams, 'sortBy' | 'sortOrder'> {
  switch (sortBy) {
    case 'newest':
      return { sortBy: 'createdAt', sortOrder: 'desc' };
    case 'popular':
      return { sortBy: 'featured', sortOrder: 'desc' };
    case 'price-asc':
      return { sortBy: 'price', sortOrder: 'asc' };
    case 'price-desc':
      return { sortBy: 'price', sortOrder: 'desc' };
    case 'code-desc':
    default:
      return { sortBy: 'sku', sortOrder: 'desc' };
  }
}
