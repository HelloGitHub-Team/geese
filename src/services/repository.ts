import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { Repository } from '@/types/reppsitory';

export const getDetail = async (rid: string): Promise<Repository> => {
  const data = await fetcher<Repository>(makeUrl(`/repository/detail/${rid}/`));
  return data;
};
