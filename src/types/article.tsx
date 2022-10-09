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
  head_image: string;
  desc: string;
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
