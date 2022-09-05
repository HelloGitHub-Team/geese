import { UserType } from './user';

export interface HomeItems {
  page: number;
  data: HomeItem[];
  has_more: boolean;
}

export interface ItemProps {
  item: HomeItem;
}

export interface HomeItem {
  item_id: string;
  author: string;
  author_avatar: string;
  title: string;
  description: string;
  primary_lang: string;
  lang_color: string;
  clicks_total: number;
  comment_total: number;
  updated_at: string;
  user: UserType;
}

export interface Stats {
  repo_total: number;
  user_total: number;
  period_total: number;
}
