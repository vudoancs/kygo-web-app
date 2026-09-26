import type { Product } from '@/data/products';

/** Giảm 10% khi thuê 1 ngày (gói mặc định 3 ngày) — khớp server (`orders.service` 0.9×). */
const ONE_DAY_RATE = 0.9;

export interface RentCartPricing {
  price: number;
  /** Giá gốc gạch ngang — chỉ khi giảm giá thuê đang hiệu lực. */
  originalPrice?: number;
  discountPercent?: number;
}

/**
 * Giá dòng thuê trong giỏ từ `Product` (đã map từ API, giá hiệu lực do server tính theo lịch giảm giá).
 * Dùng chung ProductDetail (thêm giỏ) và Cart/Checkout (làm mới giá).
 */
export function rentCartPricing(product: Product, rentDuration: number): RentCartPricing {
  const scale = (value: number) =>
    rentDuration === 1 ? Math.round(value * ONE_DAY_RATE) : value;
  const price = scale(product.rentPricePerDay);
  const original = product.originalRentPricePerDay;
  if (original && original > product.rentPricePerDay) {
    return {
      price,
      originalPrice: scale(original),
      discountPercent: product.salePercent,
    };
  }
  return { price };
}
