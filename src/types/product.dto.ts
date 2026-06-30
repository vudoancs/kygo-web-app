/** DTO mẫu — đồng bộ với NestJS khi API sẵn sàng. */
export interface ProductRentalCalendarDto {
  unavailableDates: string[];
  rentedDates?: string[];
  bookedDates?: string[];
}

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
  /** Giá mua gốc khi có khuyến mãi. */
  originalBuyPrice?: number;
  /** Giá thuê gốc khi có khuyến mãi. */
  originalRentPricePerDay?: number;
  /** Giá thuê tính theo lần (UI: nhãn /lần, không ghi chú % ngày kế). */
  rentByTime?: boolean;
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
  tags?: string[];
  badge?: 'new' | 'sale' | 'hot';
  popular?: boolean;
  availableForRent?: boolean;
  availableForBuy?: boolean;
  /** ERP: cờ website */
  isNew?: boolean;
  isFeatured?: boolean;
  rentalCalendar?: ProductRentalCalendarDto;
}

export interface ProductListResponseDto {
  items: ProductDto[];
  total: number;
  page: number;
  pageSize: number;
}
