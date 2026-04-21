/**
 * SEO path (segment) ↔ category code (CMS).
 * Mở rộng: thêm dòng mapping khi có danh mục mới (không hardcode logic nghiệp vụ).
 */
export const CMS_CATEGORY_CODE_TO_PATH: Record<string, string> = {
  BEAUTY_TIPS: 'bi-quyet-lam-dep',
  EVENTS_HOA_KHOI: 'su-kien-hoa-khoi',
};

export const CMS_CATEGORY_PATH_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(CMS_CATEGORY_CODE_TO_PATH).map(([code, path]) => [path, code]),
);

export function getCmsCategoryPath(code: string): string | undefined {
  return CMS_CATEGORY_CODE_TO_PATH[code];
}
