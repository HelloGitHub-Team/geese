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

  summary: string;
  code: string;
  image_url: string | null;
  homepage: string | null;
  document: string | null;
  download: string | null;
  online: string | null;
  other_url: string | null;

  score: number;
  likes: number;
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

  repo_created_at: string;
  updated_at: string;
  publish_at: number;
}

export interface VoteStatus {
  is_voted: boolean;
}

export interface Vote {
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

export interface BaseType {
  success: boolean;
}

export interface CommentItem {
  comment: string;
  belong_id: string;
  belong: string;
  cid: string;
  votes: number;
  user: {
    uid: string;
    nickname: string;
    avatar: string;
  };
  score: number;
  is_used: boolean;
  is_hot: boolean;
  is_voted: boolean;
  created_at: string;
  updated_at: string;
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
export interface CommentSuccessData {
  /** 今日已发布几条 */
  posted: number;
  /** 一天一共能发布几条评论 */
  limit: number;
  /** 今天还能发布几条 */
  remaining: number;
  data: CommentItemData;
}
