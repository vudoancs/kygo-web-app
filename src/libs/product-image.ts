export const DEFAULT_PRODUCT_IMAGE = '/images/product-placeholder.svg';

export function resolveProductImage(src?: string | null): string {
  const trimmed = src?.trim();
  return trimmed ? trimmed : DEFAULT_PRODUCT_IMAGE;
}

export function resolveProductImages(images?: string[] | null): string[] {
  const filtered = images?.map((item) => item?.trim()).filter((item): item is string => Boolean(item));
  return filtered?.length ? filtered : [DEFAULT_PRODUCT_IMAGE];
}
