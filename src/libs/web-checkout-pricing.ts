import type { CartItem } from '@/modules/app-state';

export function webCheckoutPricing(cart: CartItem[]) {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const eligibleSubtotal = cart.reduce(
    (sum, item) => sum + (item.type === 'rent' && item.rentDuration === 1 ? 0 : item.price),
    0,
  );
  const discount = Math.round((eligibleSubtotal * 12) / 100);
  return { subtotal, discount, total: subtotal - discount };
}
