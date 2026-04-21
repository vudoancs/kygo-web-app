export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  images: string[];
  productCode?: string;
  /** true: giá thuê theo lần (card hiển thị nhãn /lần, không ghi chú phụ phí ngày). */
  rentByTime?: boolean;
  buyPrice: number;
  originalBuyPrice?: number; // Original price before discount
  rentPricePerDay: number;
  rentPriceDanang?: number; // Rental price for Da Nang
  originalRentPriceDanang?: number; // Original rental price for Da Nang before discount
  rentPriceProvince?: number; // Rental price for provinces
  originalRentPriceProvince?: number; // Original rental price for provinces before discount
  deposit: number;
  sizes: string[];
  colors: string[];
  brand: string;
  occasion: string[];
  style: string[];
  badge?: 'new' | 'sale' | 'hot';
  salePercent?: number;
  unavailableDates?: string[]; // ISO date strings
  popular?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Đầm Dạ Hội Cao Cấp Đính Đá',
    category: 'dresses',
    subcategory: 'luxury-embellished',
    description: 'Váy dạ hội cao cấp với thiết kế sang trọng, đính đá tinh tế. Chất liệu vải cao cấp, form dáng ôm body hoàn hảo, tôn lên vẻ đẹp quyến rũ và quý phái.',
    image: 'https://images.unsplash.com/photo-1768823341746-d1983ff626a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVuaW5nJTIwZ293biUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3Njk1NzUwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1768823341746-d1983ff626a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVuaW5nJTIwZ293biUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3Njk1NzUwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1768885560206-e59e4209b742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwc2VxdWluJTIwZXZlbmluZyUyMGdvd24lMjBtb2RlbHxlbnwxfHx8fDE3Njk1ODkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1732950217690-dca11b6f7353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbmluZyUyMGRyZXNzJTIwZGV0YWlsJTIwY2xvc2V1cHxlbnwxfHx8fDE3Njk1ODkwMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1765229284842-e0160d7e7ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZXF1aW4lMjBkcmVzcyUyMGZ1bGwlMjBsZW5ndGh8ZW58MXx8fHwxNzY5NTg5MDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    productCode: '101020',
    buyPrice: 8500000,
    originalBuyPrice: 10000000,
    rentPricePerDay: 850000,
    rentPriceDanang: 850000,
    originalRentPriceDanang: 1000000,
    rentPriceProvince: 950000,
    originalRentPriceProvince: 1100000,
    deposit: 2000000,
    sizes: ['S', 'M', 'L'],
    colors: ['Đỏ burgundy', 'Đen'],
    brand: 'Kygo Luxury',
    occasion: ['Dạ hội', 'Dự tiệc', 'Cuộc thi'],
    style: ['Gợi cảm', 'Thanh lịch'],
    badge: 'hot',
    popular: true,
    unavailableDates: ['2025-02-14', '2025-02-15', '2025-02-16'],
  },
  {
    id: '2',
    name: 'Váy Cưới Trắng Công Chúa',
    category: 'dresses',
    subcategory: 'princess-dresses',
    description: 'Thiết kế váy cưới kiểu công chúa với chân váy bồng bềnh lãng mạn. Phù hợp cho các buổi lễ cưới, chụp ảnh cưới hoặc sự kiện trang trọng.',
    image: 'https://images.unsplash.com/photo-1761459257216-563245209171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2hpdGUlMjB3ZWRkaW5nJTIwZHJlc3MlMjBtb2RlbHxlbnwxfHx8fDE3Njk1NzUwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1761459257216-563245209171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2hpdGUlMjB3ZWRkaW5nJTIwZHJlc3MlMjBtb2RlbHxlbnwxfHx8fDE3Njk1NzUwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 12000000,
    originalBuyPrice: 14000000,
    rentPricePerDay: 1200000,
    rentPriceDanang: 1200000,
    originalRentPriceDanang: 1400000,
    rentPriceProvince: 1350000,
    originalRentPriceProvince: 1500000,
    deposit: 3000000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Kem'],
    brand: 'Kygo Bridal',
    occasion: ['Đám cưới', 'Dạ hội'],
    style: ['Công chúa', 'Thanh lịch'],
    badge: 'hot',
    popular: true,
  },
  {
    id: '3',
    name: 'Đầm Dạ Hội Đỏ Quyến Rũ',
    category: 'dresses',
    subcategory: 'evening-gowns',
    description: 'Đầm dạ hội màu đỏ nổi bật với thiết kế xẻ tà quyến rũ. Hoàn hảo cho những buổi tiệc tối và sự kiện quan trọng.',
    image: 'https://images.unsplash.com/photo-1768609957035-4313c3935440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjByZWQlMjBjYXJwZXQlMjBnb3dufGVufDF8fHx8MTc2OTU3NTAxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1768609957035-4313c3935440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjByZWQlMjBjYXJwZXQlMjBnb3dufGVufDF8fHx8MTc2OTU3NTAxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 7500000,
    originalBuyPrice: 9000000,
    rentPricePerDay: 750000,
    rentPriceDanang: 750000,
    originalRentPriceDanang: 900000,
    rentPriceProvince: 850000,
    originalRentPriceProvince: 1000000,
    deposit: 1800000,
    sizes: ['S', 'M', 'L'],
    colors: ['Đỏ'],
    brand: 'Kygo Evening',
    occasion: ['Dạ hội', 'Dự tiệc'],
    style: ['Gợi cảm', 'Nổi bật'],
    badge: 'hot',
    popular: true,
  },
  {
    id: '4',
    name: 'Đầm Đen Sang Trọng',
    category: 'dresses',
    subcategory: 'evening-gowns',
    description: 'Đầm dạ hội màu đen cổ điển với thiết kế thanh lịch và tinh tế. Phù hợp cho mọi dáng người và dễ dàng phối hợp phụ kiện.',
    image: 'https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmxhY2slMjBldmVuaW5nJTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1MDEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmxhY2slMjBldmVuaW5nJTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1MDEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 6500000,
    originalBuyPrice: 7800000,
    rentPricePerDay: 650000,
    rentPriceDanang: 650000,
    originalRentPriceDanang: 780000,
    rentPriceProvince: 750000,
    originalRentPriceProvince: 850000,
    deposit: 1500000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Đen'],
    brand: 'Kygo Classic',
    occasion: ['Dạ hội', 'Dự tiệc', 'Công sở'],
    style: ['Thanh lịch', 'Cá tính'],
    badge: 'hot',
  },
  {
    id: '5',
    name: 'Váy Công Chúa Hồng Pastel',
    category: 'dresses',
    subcategory: 'princess-dresses',
    description: 'Váy công chúa màu hồng pastel nhẹ nhàng với chân váy xòe bồng bềnh. Lý tưởng cho các bạn yêu thích phong cách ngọt ngào.',
    image: 'https://images.unsplash.com/photo-1763625645366-b12410f63f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmluY2VzcyUyMGJhbGwlMjBnb3duJTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1MDEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1763625645366-b12410f63f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmluY2VzcyUyMGJhbGwlMjBnb3duJTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1MDEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 5500000,
    rentPricePerDay: 550000,
    rentPriceDanang: 550000,
    originalRentPriceDanang: 680000,
    rentPriceProvince: 650000,
    originalRentPriceProvince: 780000,
    deposit: 1300000,
    sizes: ['S', 'M', 'L'],
    colors: ['Hồng pastel', 'Xanh pastel'],
    brand: 'Kygo Princess',
    occasion: ['Dự tiệc', 'Cuộc thi'],
    style: ['Công chúa', 'Thanh lịch'],
  },
  {
    id: '6',
    name: 'Đầm Sequin Ánh Kim Lấp Lánh',
    category: 'dresses',
    subcategory: 'sequin-dresses',
    description: 'Đầm sequin ánh kim lấp lánh với thiết kế hiện đại. Chắc chắn bạn sẽ trở thành tâm điểm của mọi bữa tiệc.',
    image: 'https://images.unsplash.com/photo-1759349394750-f85f5c3fc4b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXF1aW4lMjBjb2NrdGFpbCUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3Njk1NzUwMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1759349394750-f85f5c3fc4b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXF1aW4lMjBjb2NrdGFpbCUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3Njk1NzUwMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 4500000,
    rentPricePerDay: 450000,
    rentPriceDanang: 450000,
    originalRentPriceDanang: 560000,
    rentPriceProvince: 530000,
    originalRentPriceProvince: 650000,
    deposit: 1100000,
    sizes: ['S', 'M', 'L'],
    colors: ['Bạc', 'Vàng gold'],
    brand: 'Kygo Glam',
    occasion: ['Dự tiệc', 'Hẹn hò – dạo phố'],
    style: ['Nổi bật', 'Năng động'],
    badge: 'sale',
    salePercent: 20,
  },
  {
    id: '7',
    name: 'Đầm Vàng Gold Sang Trọng',
    category: 'dresses',
    subcategory: 'evening-gowns',
    description: 'Đầm dạ hội màu vàng gold lộng lẫy, thiết kế tinh tế với đường may hoàn hảo. Phù hợp cho các sự kiện trang trọng.',
    image: 'https://images.unsplash.com/photo-1769038949190-8ad222519be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZ29sZCUyMHBhcnR5JTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1769038949190-8ad222519be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZ29sZCUyMHBhcnR5JTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 9500000,
    rentPricePerDay: 950000,
    rentPriceDanang: 950000,
    originalRentPriceDanang: 1180000,
    rentPriceProvince: 1050000,
    originalRentPriceProvince: 1280000,
    deposit: 2200000,
    sizes: ['S', 'M', 'L'],
    colors: ['Vàng gold'],
    brand: 'Kygo Luxury',
    occasion: ['Dạ hội', 'Cuộc thi', 'Đám cưới'],
    style: ['Thanh lịch', 'Nổi bật'],
    popular: true,
  },
  {
    id: '8',
    name: 'Đầm Midi Hồng Pastel Ngọt Ngào',
    category: 'dresses',
    subcategory: 'midi-dresses',
    description: 'Đầm midi màu hồng pastel nhẹ nhàng với thiết kế hiện đại. Hoàn hảo cho buổi hẹn hò hoặc dự tiệc nhẹ nhàng.',
    image: 'https://images.unsplash.com/photo-1760920193003-4986423fb17c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbWlkaSUyMGNvY2t0YWlsJTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1760920193003-4986423fb17c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwbWlkaSUyMGNvY2t0YWlsJTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 3500000,
    rentPricePerDay: 350000,
    rentPriceDanang: 350000,
    originalRentPriceDanang: 450000,
    rentPriceProvince: 430000,
    originalRentPriceProvince: 530000,
    deposit: 900000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Hồng pastel'],
    brand: 'Kygo Sweet',
    occasion: ['Hẹn hò – dạo phố', 'Dự tiệc'],
    style: ['Thanh lịch', 'Công chúa'],
  },
  {
    id: '9',
    name: 'Đầm Xanh Dương Kiêu Sa',
    category: 'dresses',
    subcategory: 'evening-gowns',
    description: 'Đầm dạ hội xanh dương kiêu sa với thiết kế thanh lịch. Tôn dáng hoàn hảo cho mọi vóc dáng.',
    image: 'https://images.unsplash.com/photo-1763959945078-c4f5daa3d766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmx1ZSUyMGV2ZW5pbmclMjBnb3dufGVufDF8fHx8MTc2OTU3NTQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1763959945078-c4f5daa3d766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmx1ZSUyMGV2ZW5pbmclMjBnb3dufGVufDF8fHx8MTc2OTU3NTQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 6800000,
    rentPricePerDay: 680000,
    rentPriceDanang: 680000,
    originalRentPriceDanang: 850000,
    rentPriceProvince: 780000,
    originalRentPriceProvince: 950000,
    deposit: 1600000,
    sizes: ['S', 'M', 'L'],
    colors: ['Xanh dương'],
    brand: 'Kygo Evening',
    occasion: ['Dạ hội', 'Dự tiệc'],
    style: ['Thanh lịch', 'Gợi cảm'],
  },
  {
    id: '10',
    name: 'Đầm Lông Cao Cấp',
    category: 'dresses',
    subcategory: 'feather-dresses',
    description: 'Đầm lông cao cấp với thiết kế độc đáo và sang trọng. Chất liệu lông vũ cao cấp, tạo điểm nhấn ấn tượng.',
    image: 'https://images.unsplash.com/photo-1768885560329-5a07715b4447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZWF0aGVyJTIwbHV4dXJ5JTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1NDE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1768885560329-5a07715b4447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZWF0aGVyJTIwbHV4dXJ5JTIwZHJlc3N8ZW58MXx8fHwxNzY5NTc1NDE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 11500000,
    rentPricePerDay: 1150000,
    rentPriceDanang: 1150000,
    originalRentPriceDanang: 1420000,
    rentPriceProvince: 1280000,
    originalRentPriceProvince: 1550000,
    deposit: 2800000,
    sizes: ['S', 'M', 'L'],
    colors: ['Trắng kem', 'Đen'],
    brand: 'Kygo Luxury',
    occasion: ['Dạ hội', 'Cuộc thi'],
    style: ['Nổi bật', 'Thanh lịch'],
    badge: 'new',
  },
  {
    id: '11',
    name: 'Đầm Ngắn Dự Tiệc Thanh Lịch',
    category: 'dresses',
    subcategory: 'short-dresses',
    description: 'Đầm ngắn thanh lịch cho các buổi tiệc cocktail. Thiết kế trẻ trung, năng động nhưng vẫn sang trọng.',
    image: 'https://images.unsplash.com/photo-1762510658623-0a8e9bd151ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9ydCUyMHBhcnR5JTIwZHJlc3MlMjBlbGVnYW50fGVufDF8fHx8MTc2OTU3NTQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1762510658623-0a8e9bd151ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9ydCUyMHBhcnR5JTIwZHJlc3MlMjBlbGVnYW50fGVufDF8fHx8MTc2OTU3NTQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 2800000,
    rentPricePerDay: 280000,
    rentPriceDanang: 280000,
    originalRentPriceDanang: 360000,
    rentPriceProvince: 330000,
    originalRentPriceProvince: 410000,
    deposit: 700000,
    sizes: ['S', 'M', 'L'],
    colors: ['Đen', 'Xanh navy'],
    brand: 'Kygo Cocktail',
    occasion: ['Dự tiệc', 'Hẹn hò – dạo phố'],
    style: ['Năng động', 'Thanh lịch'],
  },
  {
    id: '12',
    name: 'Đầm Tím Công Chúa Lộng Lẫy',
    category: 'dresses',
    subcategory: 'princess-dresses',
    description: 'Đầm công chúa màu tím lộng lẫy với chân váy xòe bồng bềnh. Thiết kế như một nàng công chúa trong truyện cổ tích.',
    image: 'https://images.unsplash.com/photo-1762808199193-fe0981ca52c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBiYWxsJTIwZ293bnxlbnwxfHx8fDE3Njk1NzU0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1762808199193-fe0981ca52c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBiYWxsJTIwZ293bnxlbnwxfHx8fDE3Njk1NzU0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    buyPrice: 7200000,
    rentPricePerDay: 720000,
    rentPriceDanang: 720000,
    originalRentPriceDanang: 900000,
    rentPriceProvince: 820000,
    originalRentPriceProvince: 1000000,
    deposit: 1700000,
    sizes: ['S', 'M', 'L'],
    colors: ['Tím', 'Hồng tím'],
    brand: 'Kygo Princess',
    occasion: ['Dạ hội', 'Dự tiệc', 'Đám cưới'],
    style: ['Công chúa', 'Nổi bật'],
    popular: true,
  },
];

export const occasions = [
  { id: 'cong-so', label: 'Công sở', icon: '💼' },
  { id: 'da-hoi', label: 'Dạ hội', icon: '✨' },
  { id: 'du-tiec', label: 'Dự tiệc', icon: '🎉' },
  { id: 'cuoc-thi', label: 'Cuộc thi', icon: '👑' },
  { id: 'dam-cuoi', label: 'Đám cưới', icon: '💒' },
  { id: 'hen-ho', label: 'Hẹn hò – dạo phố', icon: '🌸' },
];

/** Giá trị gửi API / filter ERP (tiếng Việt, khớp admin). */
export const occasionApiValueById: Record<string, string> = {
  'cong-so': 'Công sở',
  'da-hoi': 'Dạ hội',
  'du-tiec': 'Dự tiệc',
  'cuoc-thi': 'Cuộc thi',
  'dam-cuoi': 'Đám cưới',
  'hen-ho': 'Hẹn hò – dạo phố',
};

export const styles = [
  { id: 'ca-tinh', label: 'Cá tính', icon: '🔥' },
  { id: 'cong-chua', label: 'Công chúa', icon: '👸' },
  { id: 'goi-cam', label: 'Gợi cảm', icon: '💋' },
  { id: 'nang-dong', label: 'Năng động', icon: '⚡' },
  { id: 'thanh-lich', label: 'Thanh lịch', icon: '🌹' },
  { id: 'noi-bat', label: 'Nổi bật', icon: '⭐' },
];

export const styleApiValueById: Record<string, string> = {
  'ca-tinh': 'Cá tính',
  'cong-chua': 'Công chúa',
  'goi-cam': 'Gợi cảm',
  'nang-dong': 'Năng động',
  'thanh-lich': 'Thanh lịch',
  'noi-bat': 'Nổi bật',
};

// Localization helpers
type Language = 'vi' | 'en' | 'ko';

export const getLocalizedOccasions = (language: Language) => {
  const translations: Record<string, Record<Language, string>> = {
    'cong-so': { vi: 'Công sở', en: 'Office', ko: '사무실' },
    'da-hoi': { vi: 'Dạ hội', en: 'Evening', ko: '이브닝' },
    'du-tiec': { vi: 'Dự tiệc', en: 'Party', ko: '파티' },
    'cuoc-thi': { vi: 'Cuộc thi', en: 'Contest', ko: '대회' },
    'dam-cuoi': { vi: 'Đám cưới', en: 'Wedding', ko: '결혼식' },
    'hen-ho': { vi: 'Hẹn hò – dạo phố', en: 'Dating & Street', ko: '데이트 & 산책' },
  };
  
  return occasions.map(o => ({
    ...o,
    label: translations[o.id]?.[language] || o.label,
  }));
};

export const getLocalizedStyles = (language: Language) => {
  const translations: Record<string, Record<Language, string>> = {
    'ca-tinh': { vi: 'Cá tính', en: 'Unique', ko: '개성있는' },
    'cong-chua': { vi: 'Công chúa', en: 'Princess', ko: '공주' },
    'goi-cam': { vi: 'Gợi cảm', en: 'Sexy', ko: '섹시' },
    'nang-dong': { vi: 'Năng động', en: 'Dynamic', ko: '활동적' },
    'thanh-lich': { vi: 'Thanh lịch', en: 'Elegant', ko: '우아한' },
    'noi-bat': { vi: 'Nổi bật', en: 'Standout', ko: '돋보이는' },
  };
  
  return styles.map(s => ({
    ...s,
    label: translations[s.id]?.[language] || s.label,
  }));
};