import type { Product } from '@/data/products';
import type { ProductDto } from '@/types/product.dto';

/** Map DTO API → entity UI hiện tại (mock `Product`). Bổ sung field trên `ProductDto` khi Nest trả đủ. */
export function productFromDto(dto: ProductDto): Product {
  const images = dto.images?.length ? dto.images : [];
  const image = images[0] ?? '';
  const buyPrice = dto.buyPrice ?? dto.price ?? 0;
  const rentPricePerDay =
    dto.rentPricePerDay ?? (buyPrice > 0 ? Math.max(1, Math.round(buyPrice * 0.1)) : 0);

  return {
    id: dto.id,
    name: dto.name,
    productCode: dto.sku,
    rentByTime: dto.rentByTime,
    category: dto.category ?? 'dresses',
    subcategory: dto.subcategory ?? dto.slug ?? 'evening-gowns',
    description: dto.description ?? '',
    image,
    images: images.length ? images : [image].filter(Boolean),
    buyPrice,
    rentPricePerDay,
    deposit: dto.deposit ?? (buyPrice > 0 ? Math.round(buyPrice * 0.2) : 0),
    sizes: dto.sizes?.length ? dto.sizes : ['S', 'M', 'L'],
    colors: dto.colors?.length ? dto.colors : ['—'],
    brand: dto.brand ?? 'Kygo',
    occasion: dto.occasions?.length ? dto.occasions : dto.occasion ?? [],
    style: dto.styles?.length ? dto.styles : dto.style ?? [],
    badge: dto.badge ?? (dto.isNew ? 'new' : dto.isFeatured ? 'hot' : undefined),
    popular: dto.popular ?? dto.isFeatured,
  };
}
