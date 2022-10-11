import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { TagPage } from '@/types/tag';

export const getTagPageItems = async (
  ip: string,
  tid: string
): Promise<TagPage> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const data = await fetcher<TagPage>(makeUrl(`/tag/${tid}`), req);
  return data;
};
