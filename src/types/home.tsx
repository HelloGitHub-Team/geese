import { TagType } from './tag';

export interface HomeItems {
  success: boolean;
  page: number;
  data: HomeItem[];
  tags: TagType[];
  has_more: boolean;
}

export interface ItemProps {
  item: HomeItem;
  index: number;
}

export interface HomeItem {
  item_id: string;
  author: string;
  author_avatar: string;
  title: string;
  name: string;
  description: string;
  primary_lang: string;
  lang_color: string;
  clicks_total: number;
  comment_total: number;
  updated_at: string;
}

export interface Stats {
  repo_total: number;
  user_total: number;
  period_total: number;
}
