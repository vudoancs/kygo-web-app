import type { WebCategoryNode } from '@/types/web-category.dto';

/** Slug danh mục gốc «Váy đầm dạ hội» trên ERP — khớp URL `/products/vay-dam-da-hoi`. */
export const DRESSES_CATEGORY_ROOT_SLUG = 'vay-dam-da-hoi';

export function findCategoryNodeBySlug(
  tree: WebCategoryNode[],
  slug: string,
): WebCategoryNode | undefined {
  for (const node of tree) {
    if (node.slug === slug) return node;
    const inChild = findCategoryNodeBySlug(node.children ?? [], slug);
    if (inChild) return inChild;
  }
  return undefined;
}

/** Thu thập slug của node và toàn bộ danh mục con (đệ quy). */
export function collectCategorySlugsUnderNode(node: WebCategoryNode): string[] {
  const slugs = [node.slug];
  for (const child of node.children ?? []) {
    slugs.push(...collectCategorySlugsUnderNode(child));
  }
  return [...new Set(slugs)];
}

/**
 * Slug gửi lên GET /web/products — mở rộng danh mục cha + con.
 * `all` hoặc không có slug → toàn bộ váy đầm dạ hội (cây gốc).
 */
export function resolveProductListCategorySlugs(
  routeSlug: string | undefined,
  tree?: WebCategoryNode[],
): string[] | undefined {
  const normalized = routeSlug?.trim() || undefined;

  if (!normalized || normalized === 'all') {
    if (tree?.length) {
      const root =
        findCategoryNodeBySlug(tree, DRESSES_CATEGORY_ROOT_SLUG) ?? tree[0];
      return root ? collectCategorySlugsUnderNode(root) : undefined;
    }
    return [DRESSES_CATEGORY_ROOT_SLUG];
  }

  if (tree?.length) {
    const node = findCategoryNodeBySlug(tree, normalized);
    if (node) return collectCategorySlugsUnderNode(node);
  }

  return [normalized];
}

/** Danh sách phẳng cho sidebar filter: `id` = slug (URL). */
export function flattenCategoryTreeForFilter(
  tree: WebCategoryNode[],
): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const walk = (nodes: WebCategoryNode[], depth: number) => {
    for (const n of nodes) {
      const prefix = depth > 0 ? `${'· '.repeat(depth)}` : '';
      out.push({ id: n.slug, label: `${prefix}${n.name}` });
      if (n.children?.length) walk(n.children, depth + 1);
    }
  };
  walk(tree, 0);
  return out;
}
