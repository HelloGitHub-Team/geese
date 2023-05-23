import { HomeItem } from './home';
import { TagType } from './tag';
import { UserType } from './user';

export interface RepositoryItems {
  repositories: HomeItem[];
}

export interface RepositoryProps {
  repo: Repository;
}

export interface StarHistory {
  increment: number;
  max: number;
  min: number;
  y: [];
  x: [];
}

export interface Repository extends RepoType {
  author: string;
  share_user: UserType;
  tags: TagType[];
  is_active: boolean;
  volume_name: string | null;

  summary: string;
  code: string;
  image_url: string | null;
  author_avatar: string;
  homepage: string | null;
  document: string | null;
  download: string | null;
  online: string | null;
  other_url: string | null;
  license_lid: string;

  star_history: StarHistory;

  release_tag: string | null;
  contributors: number | null;
  score: number;
  score_str: string | null;
  votes: number;
  collect_total: number;
  comment_total: number;
  praise_rate: number;
  tid: string | null | undefined;
}

export interface RepositorySuccessData extends BaseType {
  data: Repository;
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
  summary: string;
  forks: number;
  stars: number;
  stars_str: string;
  open_issues: number;
  subscribers: number;
  primary_lang: string;
  lang_color: string;

  license: string;
  license_lid: string;
  has_chinese: boolean;
  is_org: boolean;
  is_show: boolean;
  is_deleted?: boolean;

  repo_created_at: string;
  updated_at: string;
  publish_at: number;
}

export interface UserActionStatus extends BaseType {
  is_voted: boolean;
  is_collected: boolean;
}

export interface Collect extends BaseType {
  posted: number;
  limit: number;
  remaining: number;
  data: CollectType;
}

export interface Vote extends BaseType {
  posted: number;
  limit: number;
  remaining: number;
  data: VoteType;
}

export interface VoteType {
  belong: string;
  belong_id: string;
  total: number;
}

export interface CollectType {
  cid: string;
  total: number;
}

export interface BaseType {
  success: boolean;
  message?: string;
}

export interface VoteItemData {
  uid: string;
  repo: RepoType;
  created_at: string;
}

export interface CommentItemData {
  /** 评论内容 */
  comment: string;
  /** 评论对应的开源项目 ID */
  belong_id: string;
  /** 评论类别 */
  belong: 'repository' | 'article';
  /** 评论 ID */
  cid: string;
  /** 评论被点按的总数 */
  votes: number;
  /** 发布评论的用户信息 */
  user: {
    uid: string;
    nickname: string;
    avatar: string;
  };
  /** 评分 */
  score: number;
  /** 是否用过 */
  is_used: boolean;
  /** 是否置顶（后台编辑） */
  is_hot: boolean;
  /** 是否精选 */
  is_show: boolean;
  /** 评论发布时间 */
  created_at: string;
  /** 是否已点赞 */
  is_voted?: boolean;
}

/**
 * 获取评论接口返回的数据
 */
export interface CommentData {
  /** 展出的评论总条数 */
  total: number;
  /** 当前访问该项目的用户，发布过的评论内容 */
  current_comment: CommentItemData;
  data: CommentItemData[];
  /** 第几页 */
  page: number;
  /** 是否有下一页 */
  has_more: boolean;
}

/**
 * 评论和点赞成功后返回的数据
 */
export interface CommentSuccessData extends BaseType {
  /** 今日已发布几条 */
  posted: number;
  /** 一天一共能发布几条评论 */
  limit: number;
  /** 今天还能发布几条 */
  remaining: number;
  data: CommentItemData;
}

export interface CreateRepoRes {
  message: string;
  posted?: number;
  remaining?: number;
  success: boolean;
}

type CheckRepoResData = {
  is_exist: boolean;
};

export interface CheckRepoRes extends BaseType {
  data: CheckRepoResData;
}

// 收藏夹的类型
export type Favorite = {
  fid: string;
  name: string;
  description?: string;
  uid?: string;
  status?: number;
  pv?: number;
  uv?: number;
  total: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  publish_at?: string;
};

export interface FavoriteRes extends BaseType {
  data: Favorite[];
  in_person: boolean;
}
