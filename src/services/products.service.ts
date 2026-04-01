import { unwrapKygoApiBody } from '@/libs/unwrap-api-body';
import { httpRequestOrThrow } from '@/services/http/client';
import type { ProductDto, ProductListResponseDto } from '@/types/product.dto';

const DEFAULT_PAGE_SIZE = 12;

/** Tham số query storefront — khớp `WebProductListQueryDto` (ERP). */
export type FetchProductsParams = {
  page?: number;
  pageSize?: number;
  /** Slug / id category (OR) */
  category?: string[];
  occasion?: string[];
  style?: string[];
  size?: string[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
  /** Tên / SKU / mã váy */
  search?: string;
  listingMode?: 'all' | 'rent' | 'buy';
  rentStart?: string;
  rentEnd?: string;
  /** Chỉ sản phẩm nổi bật */
  featured?: boolean;
  /** Chỉ sản phẩm hàng mới */
  isNew?: boolean;
};

function appendStringArray(sp: URLSearchParams, key: string, values?: string[]): void {
  if (!values?.length) return;
  for (const v of values) {
    const s = String(v).trim();
    if (s) sp.append(key, s);
  }
}

function appendQuery(sp: URLSearchParams, params: FetchProductsParams): void {
  if (params.page != null && params.page >= 1) sp.set('page', String(params.page));
  sp.set('pageSize', String(params.pageSize ?? DEFAULT_PAGE_SIZE));
  appendStringArray(sp, 'category', params.category);
  appendStringArray(sp, 'occasion', params.occasion);
  appendStringArray(sp, 'style', params.style);
  appendStringArray(sp, 'size', params.size);
  appendStringArray(sp, 'color', params.color);
  if (params.minPrice != null) sp.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) sp.set('maxPrice', String(params.maxPrice));
  if (params.search) sp.set('search', params.search);
  if (params.listingMode && params.listingMode !== 'all') {
    sp.set('listingMode', params.listingMode);
  }
  if (params.rentStart) sp.set('rentStart', params.rentStart);
  if (params.rentEnd) sp.set('rentEnd', params.rentEnd);
  if (params.featured === true) sp.set('featured', 'true');
  if (params.isNew === true) sp.set('isNew', 'true');
}

export async function fetchProducts(params?: FetchProductsParams): Promise<ProductListResponseDto> {
  const sp = new URLSearchParams();
  appendQuery(sp, params ?? {});
  const q = sp.toString();
  const raw = await httpRequestOrThrow<unknown>(`/web/products${q ? `?${q}` : ''}`, {
    method: 'GET',
  });
  return unwrapKygoApiBody<ProductListResponseDto>(raw);
}

/** GET /web/products/new — server ép `isNew`; không cần (và bỏ qua) `isNew` trong query. */
export async function fetchNewProducts(
  params?: Omit<FetchProductsParams, 'isNew'>,
): Promise<ProductListResponseDto> {
  const sp = new URLSearchParams();
  appendQuery(sp, params ?? {});
  const q = sp.toString();
  const raw = await httpRequestOrThrow<unknown>(`/web/products/new${q ? `?${q}` : ''}`, {
    method: 'GET',
  });
  return unwrapKygoApiBody<ProductListResponseDto>(raw);
}

/** GET /web/products/featured — server ép `isFeatured`; không cần `featured` trong query. */
export async function fetchFeaturedProducts(
  params?: Omit<FetchProductsParams, 'featured'>,
): Promise<ProductListResponseDto> {
  const sp = new URLSearchParams();
  appendQuery(sp, params ?? {});
  const q = sp.toString();
  const raw = await httpRequestOrThrow<unknown>(`/web/products/featured${q ? `?${q}` : ''}`, {
    method: 'GET',
  });
  return unwrapKygoApiBody<ProductListResponseDto>(raw);
}

export async function fetchProductById(id: string): Promise<ProductDto> {
  const raw = await httpRequestOrThrow<unknown>(`/web/products/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  return unwrapKygoApiBody<ProductDto>(raw);
}
