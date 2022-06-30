import { makeUrl } from '@/utils/api';
import { Repository } from '@/utils/types/repoType';

import { fetcher } from './base';

export const getDetail = async (rid: string): Promise<Repository> => {
  const data = await fetcher<Repository>(makeUrl(`/repository/detail/${rid}/`));
  return data;
};
