import { TagType } from './tag';
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
  title: string;
  description: string;
  clicks_total: number;
  comment_total: number;
  updated_at: string;
  tags: TagType[];
  user: UserType;
}

export interface Stats {
  repo_total: string;
  user_total: string;
  period_total: string;
}
