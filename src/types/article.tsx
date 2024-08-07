export interface ArticleItems {
  success: boolean;
  page: number;
  data: ArticleItem[];
  has_more: boolean;
}

export interface ArticleProps {
  article: ArticleContent;
}

export interface ItemProps {
  item: ArticleItem;
  index: number;
}

export interface ArticleItem {
  aid: string;
  title: string;
  title_en?: string;
  head_image: string;
  desc: string;
  desc_en?: string;
  author: string;
  is_publish: boolean;
  is_hot: boolean;
  is_original: boolean;
  clicks_count: number;
  pv_count: number;
  publish_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleContent {
  aid: string;
  content: string;
  title: string;
}

export interface ArticleContentItem {
  success: boolean;
  data: ArticleContent;
}

export interface OneItemResp {
  success: boolean;
  data: OneItem;
}

export interface OneItemsResp {
  success: boolean;
  data: TableOneItem[];
}
export interface TableOneItem {
  [key: string]: string | number | undefined;
  name: string;
  language: string;
  suggestions: string;
  oid: string;
}

export interface OneItem {
  oid: string;
  name: string;
  language: string;
  suggestions: string;
  author: string;
  uv_count: number;
  source_code: string;
  repo_url: string;
  demo_url?: string;
  package: string;
  has_depend: boolean;
  created_at: string;
}

export interface OneFileProps {
  onefile: OneItem;
}
