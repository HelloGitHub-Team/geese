export interface UserAvaterProps {
  avatar: string;
}

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
  success: string;
  uid: string;
  nickname: string;
  avatar: string;
  permission: Permission;
  contribute: number;
}

export interface OAuthURLResponse {
  url: string;
}

export interface Permission {
  name: string;
  code: string;
}

export const userInfo = {
  uid: '8MKvZoxaWt',
  nickname: '卤蛋',
  avatar:
    'https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132',
  contribute_total: 0,
  share_repo_total: 0,
  comment_repo_total: 1,
  permission: {
    name: '游客',
    code: 'visitor',
  },
  first_login: '2022-08-29T20:03:50',
  rank: 1,
  level: 1,
};

export type UserInfoType = typeof userInfo;

export type Response = {
  success: boolean;
  userInfo: UserInfoType;
};
