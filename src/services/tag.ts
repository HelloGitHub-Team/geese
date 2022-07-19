import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { TagPage } from '@/types/tag';

export const getTagPageItems = async (tid: string): Promise<TagPage> => {
  const data = await fetcher<TagPage>(makeUrl(`/tag/${tid}/`));
  return data;
};
