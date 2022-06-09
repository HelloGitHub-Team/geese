export const fetcher = async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  // if the user is not online when making the API call
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    throw new Error('OFFLINE');
  }

  //   headers.Authorization = `Bearer ${window.localStorage.getItem('Authorization')}`

  const res = await fetch(input, init);
  if (!res.ok || res.status === 500 || res.status === 404) {
    throw res;
  }
  const json = await res.json();
  return json;
};
