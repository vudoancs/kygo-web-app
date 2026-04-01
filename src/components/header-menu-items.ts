import type { WebCategoryNode } from '@/types/web-category.dto';

export type HeaderMenuItem = {
  key: string;
  label: string;
  path: string;
  dropdown?: { label: string; path: string }[];
};

export function webCategoryTreeToMenuItems(tree: WebCategoryNode[]): HeaderMenuItem[] {
  return tree.map((root) => ({
    key: `cat-${root.slug}`,
    label: root.name,
    path: `/products/${root.slug}`,
    dropdown:
      root.children?.length > 0
        ? root.children.map((c) => ({ label: c.name, path: `/products/${c.slug}` }))
        : undefined,
  }));
}

/** Menu tĩnh khi chưa cấu hình API hoặc chưa có danh mục ERP. */
export function getFallbackHeaderMenu(
  language: 'vi' | 'en' | 'ko',
  t: (key: string) => string,
): HeaderMenuItem[] {
  return [
    { key: 'home', label: t('nav.home'), path: '/' },
    {
      key: 'dresses',
      label:
        language === 'vi' ? 'Váy đầm dạ hội' : language === 'en' ? 'Evening Gowns' : '이브닝 가운',
      path: '/products/dresses',
      dropdown: [
        {
          label:
            language === 'vi'
              ? 'Đầm công chúa'
              : language === 'en'
                ? 'Princess Dresses'
                : '프린세스 드레스',
          path: '/products/princess-dresses',
        },
        {
          label: language === 'vi' ? 'Đầm lông' : language === 'en' ? 'Feather Dresses' : '깃털 드레스',
          path: '/products/feather-dresses',
        },
        {
          label: language === 'vi' ? 'Đầm set bộ' : language === 'en' ? 'Set Dresses' : '세트 드레스',
          path: '/products/set-dresses',
        },
        {
          label:
            language === 'vi'
              ? 'Đầm luxury đính đá'
              : language === 'en'
                ? 'Luxury Embellished'
                : '럭셔리 장식',
          path: '/products/luxury-embellished',
        },
        {
          label: language === 'vi' ? 'Đầm midi' : language === 'en' ? 'Midi Dresses' : '미디 드레스',
          path: '/products/midi-dresses',
        },
        {
          label: language === 'vi' ? 'Đầm có tà' : language === 'en' ? 'Train Dresses' : '트레인 드레스',
          path: '/products/train-dresses',
        },
        {
          label: language === 'vi' ? 'Đầm ngắn' : language === 'en' ? 'Short Dresses' : '쇼트 드레스',
          path: '/products/short-dresses',
        },
        {
          label:
            language === 'vi'
              ? 'Đầm bling sequin'
              : language === 'en'
                ? 'Sequin Dresses'
                : '스팽글 드레스',
          path: '/products/sequin-dresses',
        },
        {
          label:
            language === 'vi'
              ? 'Đầm dạ hội'
              : language === 'en'
                ? 'Evening Gowns'
                : '이브닝 가운',
          path: '/products/evening-gowns',
        },
      ],
    },
    { key: 'vest', label: 'Vest', path: '/products/vest' },
    {
      key: 'kids',
      label: 'Kids',
      path: '/products/kids',
      dropdown: [
        {
          label: language === 'vi' ? 'Bé gái' : language === 'en' ? 'Girls' : '여아',
          path: '/products/kids-girls',
        },
        {
          label: language === 'vi' ? 'Bé trai' : language === 'en' ? 'Boys' : '남아',
          path: '/products/kids-boys',
        },
        {
          label:
            language === 'vi'
              ? 'Giày cho bé gái'
              : language === 'en'
                ? 'Girls Shoes'
                : '여아 신발',
          path: '/products/kids-girls-shoes',
        },
        {
          label:
            language === 'vi'
              ? 'Phụ kiện cho bé'
              : language === 'en'
                ? 'Kids Accessories'
                : '아동 액세서리',
          path: '/products/kids-accessories',
        },
        {
          label:
            language === 'vi'
              ? 'Giày cho bé trai'
              : language === 'en'
                ? 'Boys Shoes'
                : '남아 신발',
          path: '/products/kids-boys-shoes',
        },
      ],
    },
    {
      key: 'style-tips',
      label:
        language === 'vi'
          ? 'Bí quyết mặc đẹp'
          : language === 'en'
            ? 'Style Tips'
            : '스타일 팁',
      path: '/style-tips',
    },
    {
      key: 'events',
      label:
        language === 'vi'
          ? 'Sự kiện & Hoa khôi'
          : language === 'en'
            ? 'Events & Beauty Queens'
            : '이벤트 & 미인 대회',
      path: '/events',
    },
  ];
}

export function getStaticTailMenu(language: 'vi' | 'en' | 'ko'): HeaderMenuItem[] {
  return [
    {
      key: 'style-tips',
      label:
        language === 'vi'
          ? 'Bí quyết mặc đẹp'
          : language === 'en'
            ? 'Style Tips'
            : '스타일 팁',
      path: '/style-tips',
    },
    {
      key: 'events',
      label:
        language === 'vi'
          ? 'Sự kiện & Hoa khôi'
          : language === 'en'
            ? 'Events & Beauty Queens'
            : '이벤트 & 미인 대회',
      path: '/events',
    },
  ];
}
