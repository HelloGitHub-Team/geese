import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

export const getURLs = async (): Promise<[]> => {
  const data = await fetcher<[]>(makeUrl(`/sitemap/`));
  return data;
};
