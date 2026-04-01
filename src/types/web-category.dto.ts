/** Khớp `StorefrontCategoryNode` từ ERP — GET /web/categories */
export interface WebCategoryNode {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  children: WebCategoryNode[];
}

export interface WebCategoriesResponse {
  tree: WebCategoryNode[];
}
