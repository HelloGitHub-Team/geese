import { getCurrentToken } from '@/hooks/useToken';

import Message from '@/components/message';

import { makeUrl } from '@/utils/api';

export const fetcher = async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  // if the user is not online when making the API call
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    throw new Error('OFFLINE');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCurrentToken()}`,
  };
  if (init?.headers) {
    init.headers = { ...defaultHeaders, ...init.headers };
  } else if (init) {
    init.headers = defaultHeaders;
  }

  const res = await fetch(input, init);

  try {
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 500) {
        if (typeof window !== 'undefined') {
          window.location.href = '/500';
        } else {
          Message.error('服务器发生错误');
        }
      } else if (res.status === 404) {
        if (typeof window !== 'undefined') {
          window.location.href = '/404';
        } else {
          Message.error('未找到该资源');
        }
      } else if (res.status === 400) {
        Message.error(json.message);
      } else if (res.status === 401) {
        if (!res.url.includes('/me/')) {
          Message.error('请先登录');
        }
      } else {
        if (json.detail) {
          Message.error(json.detail);
        } else {
          Message.error(json.message);
        }
      }
      return Object({ success: false, data: null });
    } else {
      return json;
    }
  } catch (error) {
    console.log(error);
    return Object({ success: false, data: null });
  }
};

export function fetchPost(
  fetcher: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>,
  options?: RequestInit,
  headers?: HeadersInit
) {
  return async <T>(key: string, params: Record<string, any>) => {
    const requestInit: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
      ...options,
    };

    return await fetcher<T>(makeUrl(key), requestInit);
  };
}

export const post = fetchPost(fetcher);
