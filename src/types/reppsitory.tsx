import { TagType } from './tag';
import { UserType } from './user';

export interface RepositoryProps {
  repo: Repository;
}

export interface Repository extends RepoType {
  author: string;
  share_user: UserType;
  tags: TagType[];
  is_active: boolean;
  volume_name: string | null;

  code: string;
  image_url: string | null;
  homepage: string | null;
  document: string | null;
  download: string | null;
  online: string | null;
  other_url: string | null;

  score: number;
  votes_total: number;
  tid: string | null | undefined;
}

export interface RepoTag {
  name: string;
  tid: string;
}

export interface RepoType {
  rid: string;
  url: string;
  name: string;
  full_name: string;

  title: string;
  description: string;
  forks: number;
  stars: number;
  stars_str: string;
  open_issues: number;
  subscribers: number;
  primary_lang: string;
  lang_color: string;

  license: string;
  has_chinese: boolean;
  is_org: boolean;

  created_at: string;
  updated_at: string;
  publish_at: number;
  share_user: UserType;
}
