/** DTO mẫu — đồng bộ với NestJS khi API sẵn sàng. */
export interface ProductDto {
  id: string;
  /** SKU / mã váy (ERP). */
  sku?: string;
  name: string;
  slug?: string;
  /** Giá mua — nếu backend chỉ gửi `price` thì mapper dùng `price`. */
  price?: number;
  buyPrice?: number;
  rentPricePerDay?: number;
  images: string[];
  categoryId?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  deposit?: number;
  sizes?: string[];
  colors?: string[];
  brand?: string;
  /** Đồng bộ ERP `occasions` */
  occasions?: string[];
  occasion?: string[];
  styles?: string[];
  style?: string[];
  badge?: 'new' | 'sale' | 'hot';
  popular?: boolean;
  availableForRent?: boolean;
  availableForBuy?: boolean;
  /** ERP: cờ website */
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface ProductListResponseDto {
  items: ProductDto[];
  total: number;
  page: number;
  pageSize: number;
}
