export interface LoginOutProps {
  updateLoginStatus: (value: boolean) => void;
}

export interface LoginStatusProps {
  updateLoginStatus: (value: boolean) => void;
  loginStatus: boolean;
}

export interface UserProps {
  updateLoginStatus: (value: boolean) => void;
  isLogin: boolean;
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
  uid: string;
  nickname: string;
  gender: number;
  city: string;
  province: string;
  country: string;
  avatar: string;
  permission: Permission;
  first_login: string;
  last_login: string;
}

export interface OAuthURLResponse {
  url: string;
}

export interface Permission {
  name: string;
  code: string;
}
