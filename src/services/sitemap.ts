import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface URLs {
  success: boolean;
  data: [];
}

export const getURLs = async (): Promise<URLs> => {
  const data = await fetcher<URLs>(makeUrl(`/sitemap/`));
  return data;
};
