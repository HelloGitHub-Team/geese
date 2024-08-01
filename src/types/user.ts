import { RepoType } from './repository';

export interface User {
  uid: string;
  token: string;
  userInfo: UserType;
}

export interface UserType {
  uid: string;
  nickname: string;
  avatar: string;
}

export interface UserStatusProps {
  success: boolean;
  uid: string;
  nickname: string;
  avatar: string;
  permission?: Permission;
  contribute: number;
  level: number;
  unread: UserUnreadaType;
  next_level_score: number;
  first_login?: string;
  last_login?: string;
}

export interface UserUnreadaType {
  total: number;
  repository: number;
  system: number;
}

export interface OAuthURLResponse {
  url: string;
}

export interface Permission {
  name: string;
  code: string;
}

export interface UserDetail {
  uid: string;
  nickname: string;
  avatar: string;
  contribute_total: number;
  share_repo_total: number;
  comment_repo_total: number;
  permission: Permission;
  first_login: string;
  last_login: string;
  rank: number;
  level: number;
  in_person: boolean;
}

export interface UserDetailInfo {
  success: boolean;
  userInfo: UserDetail;
  dynamicRecord: DynamicRecord[];
}

export interface DynamicRecordItem {
  name: string;
  item_id: string;
}

export interface DynamicRecord {
  uid: string;
  item: DynamicRecordItem;
  created_at: string;
  dynamic_type: string;
  value: number;
  remark: string;
}

export interface CollectItem {
  uid: string;
  created_at: string;
  repo: RepoType;
}

export interface MessageItems {
  success: boolean;
  page: number;
  data: MessageRecord[];
  has_more: boolean;
}

export interface MessageRecord {
  mid: string;
  content: string;
  content_en: string;
  publish_at: string;
  message_type?: string;
  repository?: {
    rid: string;
    name: string;
    full_name: string;
  };
  more_content?: string;
  more_content_en?: string;
  user_info?: UserType;
}
