/**
 * 筛选结果的类型
 */
export interface SearchItemType {
  rid: string;
  url: string;
  name: string;
  full_name: string;
  description: string;
  brief: string;
  primary_lang: string;
  lang_color: string;
  homepage: string | null;
  license: string | null;
  volume: string;
  category: string;
  stars: number;
  stars_str: string;
  has_chinese: boolean;
  last_commit_at: string;
}

export interface SearchResultItemProps {
  repo: SearchItemType;
}

export interface SearchResponse {
  page: number;
  data: SearchItemType[];
  has_more: boolean;
}
