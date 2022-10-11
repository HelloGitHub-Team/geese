import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface URLs {
  success: boolean;
  data: [];
}

export const getURLs = async (ip: string): Promise<URLs> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const data = await fetcher<URLs>(makeUrl(`/sitemap/`), req);
  return data;
};
