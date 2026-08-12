/** Đồng bộ `kygo-web-admin/src/modules/products/constants/product-colors.ts` */
export const PRODUCT_COLOR_OPTIONS = [
  'Trắng',
  'Kem',
  'Nude',
  'Be',
  'Đỏ',
  'Burgundy',
  'Hồng',
  'Hồng Pastel',
  'Cam',
  'Vàng',
  'Vàng Nhạt',
  'Vàng Gold',
  'Xanh Dương',
  'Xanh Lam',
  'Xanh Ngọc',
  'Xanh Lá',
  'Xanh Tím',
  'Tím',
  'Nâu',
  'Xám',
  'Đen',
  'Bạc',
  'Ivory',
  'Champagne',
] as const;

export type ProductColorOption = (typeof PRODUCT_COLOR_OPTIONS)[number];

const COLOR_SET = new Set<string>(PRODUCT_COLOR_OPTIONS);

/** Danh sách chọn filter: đủ màu chuẩn admin + màu đang chọn (nếu ngoài danh sách). */
export function buildProductColorFilterOptions(extraColors: string[] = []): string[] {
  const extras = [
    ...new Set(
      extraColors
        .map((c) => String(c || '').trim())
        .filter((c) => c && c !== '—' && !COLOR_SET.has(c)),
    ),
  ].sort((a, b) => a.localeCompare(b, 'vi'));
  return [...PRODUCT_COLOR_OPTIONS, ...extras];
}
