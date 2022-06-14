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
