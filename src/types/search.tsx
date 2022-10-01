/**
 * 筛选结果的类型
 */
export interface SearchItemType {
  rid: string;
  title: string;
  author: string;
  author_avatar: string;
  name: string;
  description: string;
  primary_lang: string;
  lang_color: string;
  stars: number;
  has_chinese: boolean;
  is_active: string;
  last_pushed_at: string;
}

export interface SearchResultItemProps {
  repo: SearchItemType;
  index: number;
}

export interface SearchResponse {
  page: number;
  data: SearchItemType[];
  has_more: boolean;
}
