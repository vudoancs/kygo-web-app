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
  /** Giá thuê gốc (trước khuyến mãi). */
  originalRentPricePerDay?: number;
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
  promotionEndsAt?: string;
  tags?: string[];
  unavailableDates?: string[]; // ISO date strings
  popular?: boolean;
}

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