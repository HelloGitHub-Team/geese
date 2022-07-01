import { Tag } from './tagType';
import { UserType } from './userType';

export interface RepositoryProps {
  repo: Repository;
}

export interface Repository extends RepoType {
  tags: Tag[];
  user: UserType;
}

// returned data type
export interface FetchData {
  data: Repository[];
  has_more: boolean;
  page: number;
}

export interface RepoType {
  item_id: string;
  url: string;
  name: string;
  full_name: string;
  volume_name: string;
  title: string;
  period_desc: string;
  description: string;
  image_url: string;
  forks: number;
  stars: number;
  stars_str: string;
  open_issues: number;
  subscribers: number;
  primary_lang: string;
  lang_color: string;
  homepage: string;
  license: string;
  item_type: number;
  has_chinese: boolean;
  is_org: boolean;
  comment_total: number;
  repo_created_time: number;
  repo_created_at: string;
  repo_pushed_time: number;
  repo_pushed_at: string;
  repo_update_time: number;
  repo_update_at: string;
  created_at: string;
  updated_at: string;
  publish_at: number;
}
