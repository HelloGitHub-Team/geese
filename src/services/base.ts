import { getCurrentToken } from '@/hooks/useToken';

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
  } else {
    init = { headers: defaultHeaders };
  }

  let message = '请求接口失败';
  const res = await fetch(input, init);
  try {
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 500) {
        if (typeof window !== 'undefined') {
          window.location.href = '/500';
        } else {
          message = '服务器发生错误';
        }
      } else if (res.status === 404) {
        if (typeof window !== 'undefined') {
          window.location.href = '/404';
        } else {
          message = '未找到该资源';
        }
      } else if (res.status === 400) {
        message = json.message;
      } else if (res.status === 401) {
        if (!res.url.includes('/me/')) {
          message = '请先登录';
        }
      } else {
        if (json.message) {
          message = json.message;
        } else {
          console.log(json);
        }
      }
      return Object({ success: false, message: message });
    } else {
      return json;
    }
  } catch (error) {
    return Object({ success: false, message: message });
  }
};
