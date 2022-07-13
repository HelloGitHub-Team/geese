import { makeUrl } from '@/utils/api';

import { fetcher, post } from './base';

import { CreateRepoRes, Repository } from '@/types/reppsitory';

export const getDetail = async (rid: string): Promise<Repository> => {
  const data = await fetcher<Repository>(makeUrl(`/repository/detail/${rid}/`));
  return data;
};

export const createRepo = async (
  params: Record<string, any>
): Promise<CreateRepoRes> => post<CreateRepoRes>(`/repository/`, params);
