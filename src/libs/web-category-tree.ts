import type { WebCategoryNode } from '@/types/web-category.dto';

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
