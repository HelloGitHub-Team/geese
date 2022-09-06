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
