export type CmsPostStatus = 'PUBLISHED' | 'HIDDEN';

export type CmsCategory = {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  excerpt: string;
  category: {
    id: string;
    code: string;
    name: string;
  };
  status: CmsPostStatus;
  createdAt: string;
  updatedAt: string;
};

export type CmsPostListResponse = {
  items: CmsPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
