/** Đồng bộ `kygo-web-admin/src/modules/products/constants/product-loai-tags.ts` */
export const PRODUCT_LOAI_TAG_OPTIONS = [
  'Áo dài',
  'Váy ngắn',
  'Đầm dạ hội',
  'Đầm NTK',
  'Đầm thiết kế',
  'Đầm ngắn',
  'Vest nữ',
  'Đầm luxury',
  'Cúp ngực',
  'Choàng cổ',
  'Chéo cổ',
  'Chéo vai',
  'Xẻ chân',
  'Xẻ tà',
  'Che vai',
  'Bẹt vai',
  'Lệch vai',
  'Cổ yếm',
  'Hở lưng',
  'Đuôi cá',
] as const;

export type ProductLoaiTag = (typeof PRODUCT_LOAI_TAG_OPTIONS)[number];

const LOAI_TAG_SET = new Set<string>(PRODUCT_LOAI_TAG_OPTIONS);

/** Nhóm hiển thị filter — khớp cách admin gọi là "loại (tag)". */
export const PRODUCT_LOAI_FILTER_GROUPS = [
  {
    id: 'dressType',
    i18nKey: 'filter.loaiGroup.dressType',
    tags: [
      'Áo dài',
      'Váy ngắn',
      'Đầm dạ hội',
      'Đầm NTK',
      'Đầm thiết kế',
      'Đầm ngắn',
      'Vest nữ',
      'Đầm luxury',
    ],
  },
  {
    id: 'neckShoulder',
    i18nKey: 'filter.loaiGroup.neckShoulder',
    tags: [
      'Cúp ngực',
      'Choàng cổ',
      'Chéo cổ',
      'Chéo vai',
      'Che vai',
      'Bẹt vai',
      'Lệch vai',
      'Cổ yếm',
    ],
  },
  {
    id: 'silhouette',
    i18nKey: 'filter.loaiGroup.silhouette',
    tags: ['Xẻ chân', 'Xẻ tà', 'Hở lưng', 'Đuôi cá'],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  i18nKey: string;
  tags: readonly ProductLoaiTag[];
}>;

export interface GroupedLoaiFilterOption {
  groupId: string;
  i18nKey: string;
  tags: string[];
}

/** Sắp xếp tag theo thứ tự chuẩn + chỉ giữ tag đang có trên storefront. */
export function sortLoaiTags(tags: string[]): string[] {
  const unique = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
  const canonical = PRODUCT_LOAI_TAG_OPTIONS.filter((t) => unique.includes(t));
  const other = unique
    .filter((t) => !LOAI_TAG_SET.has(t))
    .sort((a, b) => a.localeCompare(b, 'vi'));
  return [...canonical, ...other];
}

export function buildGroupedLoaiFilterOptions(availableTags: string[]): GroupedLoaiFilterOption[] {
  const available = new Set(availableTags);
  const used = new Set<string>();

  const groups: GroupedLoaiFilterOption[] = PRODUCT_LOAI_FILTER_GROUPS.map((group) => {
    const tags = group.tags.filter((tag) => available.has(tag));
    tags.forEach((tag) => used.add(tag));
    return {
      groupId: group.id,
      i18nKey: group.i18nKey,
      tags: [...tags],
    };
  }).filter((group) => group.tags.length > 0);

  const other = sortLoaiTags(availableTags).filter((tag) => !used.has(tag));
  if (other.length) {
    groups.push({
      groupId: 'other',
      i18nKey: 'filter.loaiGroup.other',
      tags: other,
    });
  }

  return groups;
}
