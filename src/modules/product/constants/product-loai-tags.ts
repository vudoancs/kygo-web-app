/** Nhóm hiển thị filter UI — tên tag khớp master product_tags trên API. */
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
  tags: readonly string[];
}>;

export interface GroupedLoaiFilterOption {
  groupId: string;
  i18nKey: string;
  tags: string[];
}

/** Sắp xếp theo thứ tự API (preferredOrder) rồi alphabet tiếng Việt. */
export function sortLoaiTags(tags: string[], preferredOrder?: string[]): string[] {
  const unique = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
  if (preferredOrder?.length) {
    const order = new Map(preferredOrder.map((tag, index) => [tag, index]));
    return unique.sort((a, b) => {
      const ia = order.get(a);
      const ib = order.get(b);
      if (ia != null && ib != null) return ia - ib;
      if (ia != null) return -1;
      if (ib != null) return 1;
      return a.localeCompare(b, 'vi');
    });
  }
  return unique.sort((a, b) => a.localeCompare(b, 'vi'));
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

  const other = sortLoaiTags(availableTags, availableTags).filter((tag) => !used.has(tag));
  if (other.length) {
    groups.push({
      groupId: 'other',
      i18nKey: 'filter.loaiGroup.other',
      tags: other,
    });
  }

  return groups;
}
