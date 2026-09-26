import type { Product } from '@/data/products';
import { resolveProductImage, resolveProductImages } from '@/libs/product-image';
import type { ProductDto } from '@/types/product.dto';

/** Map DTO API → entity UI hiện tại (mock `Product`). Bổ sung field trên `ProductDto` khi Nest trả đủ. */
export function productFromDto(dto: ProductDto): Product {
  const images = resolveProductImages(dto.images);
  const image = resolveProductImage(images[0]);
  const buyPrice = dto.buyPrice ?? dto.price ?? 0;

  const nested = dto.pricing;
  const rentPricePerDay =
    nested?.effectiveRentalPrice ??
    dto.rentPricePerDay ??
    (buyPrice > 0 ? Math.max(1, Math.round(buyPrice * 0.1)) : 0);
  // Có `pricing` từ ERP → chỉ gạch giá gốc khi giảm giá đang hiệu lực (trước/sau lịch → giá gốc, không gạch).
  const originalRentPricePerDay = nested
    ? nested.isOnPromotion && nested.originalRentalPrice > rentPricePerDay
      ? nested.originalRentalPrice
      : undefined
    : dto.originalRentPricePerDay;
  const salePercent =
    nested?.isOnPromotion && nested.discountPercent > 0
      ? nested.discountPercent
      : originalRentPricePerDay &&
          originalRentPricePerDay > rentPricePerDay &&
          rentPricePerDay > 0
        ? Math.round(
            ((originalRentPricePerDay - rentPricePerDay) / originalRentPricePerDay) * 100,
          )
        : undefined;

  return {
    id: dto.id,
    name: dto.name,
    productCode: dto.sku,
    rentByTime: dto.rentByTime,
    category: dto.category ?? 'dresses',
    subcategory: dto.subcategory ?? dto.slug ?? 'evening-gowns',
    description: dto.description ?? '',
    image,
    images,
    buyPrice,
    originalBuyPrice: dto.originalBuyPrice,
    rentPricePerDay,
    originalRentPricePerDay,
    originalRentPriceDanang: originalRentPricePerDay,
    deposit: dto.deposit ?? (buyPrice > 0 ? Math.round(buyPrice * 0.2) : 0),
    sizes: dto.sizes?.length ? dto.sizes : ['S', 'M', 'L'],
    colors: dto.colors?.length ? dto.colors : ['—'],
    brand: dto.brand ?? 'Kygo',
    occasion: dto.occasions?.length ? dto.occasions : dto.occasion ?? [],
    style: dto.styles?.length ? dto.styles : dto.style ?? [],
    tags: dto.tags?.length ? dto.tags : undefined,
    badge:
      dto.badge ??
      (nested?.isOnPromotion || dto.isOnPromotion
        ? 'sale'
        : dto.isNew
          ? 'new'
          : dto.isFeatured
            ? 'hot'
            : undefined),
    salePercent,
    promotionEndsAt: nested?.promotionEndsAt,
    popular: dto.popular ?? dto.isFeatured,
  };
}
