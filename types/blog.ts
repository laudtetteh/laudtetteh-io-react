export interface PostData {
  title: string;
  slug: string;
  summary: string;
  content: { html: string };
  categories: string[];
  status: 'draft' | 'published';
  featured: boolean;
  featuredImage?: string;
  weight?: number;
  date_created?: string;
  date_published?: string;
  date_updated?: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  summary: string;
  content: { html: string };
  date?: string;
  date_published?: string;
}
