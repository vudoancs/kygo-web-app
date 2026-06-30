export function formatVndPrice(price: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(price)} đ`;
}

export function hasPromotionalPrice(price: number, originalPrice?: number): boolean {
  return originalPrice != null && originalPrice > price;
}
