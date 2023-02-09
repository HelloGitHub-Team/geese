import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { OAuthURLResponse, User } from '@/types/user';

export const Logout = async (headers: any): Promise<Response> =>
  fetcher<Response>(makeUrl(`/user/logout/`), { headers: headers });

export const CurrentUser = async (headers: any): Promise<Response> =>
  fetcher<Response>(makeUrl(`/user/me/`), { headers: headers });

export const getOAuthURL = async (
  platform: string
): Promise<OAuthURLResponse> => {
  const reqData: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };

  const res = await fetch(
    makeUrl(`/user/oauth/${platform}/url/`, { url_type: 'geese' }),
    reqData
  );
  const data = await res.json();
  return data;
};

export const OAuthLoginAPI = async (
  ip: string,
  code: string,
  state: string,
  cookie: string,
  user_agent: string
): Promise<User> => {
  const req: RequestInit = {};
  req.credentials = 'include';
  req.headers = {
    'Content-Type': 'application/json',
    Cookie: cookie,
    'User-Agent': user_agent,
    'x-real-ip': ip,
    'x-forwarded-for': ip,
  };
  req.method = 'POST';
  req.body = JSON.stringify({ code: code, state: state });
  const result: User = await fetcher(makeUrl(`/user/oauth/success/`), req);
  return result;
};
