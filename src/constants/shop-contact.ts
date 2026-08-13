/** Liên hệ & thanh toán shop — dùng chung web app. */

export const SHOP_PHONE = '0799443533';
export const SHOP_PHONE_DISPLAY = '0799 443 533';
export const SHOP_ZALO_URL = `https://zalo.me/${SHOP_PHONE}`;
export const SHOP_TEL_URL = `tel:${SHOP_PHONE}`;

/**
 * VietQR động (số tiền + nội dung CK có mã đơn).
 * Cần cấu hình trong `.env`:
 * - NEXT_PUBLIC_SHOP_BANK_BIN (mã BIN, VD MB=970422)
 * - NEXT_PUBLIC_SHOP_BANK_ACCOUNT (số tài khoản)
 * - NEXT_PUBLIC_SHOP_BANK_NAME
 * - NEXT_PUBLIC_SHOP_ACCOUNT_NAME
 */
export const SHOP_BANK_BIN = process.env.NEXT_PUBLIC_SHOP_BANK_BIN?.trim() || '';

export const SHOP_BANK_ACCOUNT =
  process.env.NEXT_PUBLIC_SHOP_BANK_ACCOUNT?.trim() || '';

export const SHOP_BANK_NAME =
  process.env.NEXT_PUBLIC_SHOP_BANK_NAME?.trim() || '';

export const SHOP_ACCOUNT_NAME =
  process.env.NEXT_PUBLIC_SHOP_ACCOUNT_NAME?.trim() || 'KYGO PROM';

/** QR tĩnh fallback khi chưa cấu hình STK VietQR. */
export const SHOP_QR_IMAGE = '/images/payment-qr.png';

export function isShopVietQrConfigured(): boolean {
  return Boolean(SHOP_BANK_BIN && SHOP_BANK_ACCOUNT);
}

/** Nội dung chuyển khoản gắn mã đơn. */
export function buildTransferNote(orderNumber: string): string {
  const code = String(orderNumber || '').trim().toUpperCase();
  return code ? `KYGO ${code}` : 'KYGO';
}

/**
 * Tạo URL ảnh VietQR động.
 * https://img.vietqr.io/image/{BIN}-{ACCOUNT}-compact2.png?amount=&addInfo=&accountName=
 */
export function buildShopVietQrUrl(params: {
  amount: number;
  addInfo: string;
}): string | null {
  if (!isShopVietQrConfigured()) return null;

  const amount = Math.max(0, Math.round(params.amount));
  const addInfo = encodeURIComponent(params.addInfo.replace(/\s+/g, ' ').trim().slice(0, 100));
  const accountName = encodeURIComponent(SHOP_ACCOUNT_NAME);
  return `https://img.vietqr.io/image/${SHOP_BANK_BIN}-${SHOP_BANK_ACCOUNT}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
