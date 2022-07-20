import { getToken, makeUrl, TOKEN_KEY } from '@/utils/api';

export const fetcher = async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  // if the user is not online when making the API call
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    throw new Error('OFFLINE');
  }

  const res = await fetch(input, init);
  if (!res.ok || res.status === 500 || res.status === 404) {
    if (res.status === 500) {
      window.location.href = '/500';
    }
    if (res.status === 404) {
      window.location.href = '/404';
    }
    throw res;
  }
  const json = await res.json();
  return json;
};

export function fetchPost(
  fetcher: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>,
  options?: RequestInit,
  header?: HeadersInit
) {
  return async <T>(key: string, params: Record<string, any>) => {
    const headers = {
      [TOKEN_KEY]: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...header,
    };
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
