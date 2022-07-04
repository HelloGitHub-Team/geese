import { createContext } from 'react';

import { makeUrl } from '@/utils/api';
import { Repository } from '@/utils/types/repoType';

import { fetcher } from './base';

export interface HomeResponse {
  page: number;
  data: Repository[];
  has_more: boolean;
}

export interface Stats {
  repo_total: string;
  user_total: string;
  period_total: string;
}

export const getItems = async (
  params?: Record<string, unknown>
): Promise<HomeResponse> => {
  const data = await fetcher<HomeResponse>(makeUrl(`/`, params));
  return data;
};

export const getStats = async (): Promise<Stats> => {
  const data = await fetcher<Stats>(makeUrl(`/stats/`));
  return data;
};

export type HomeItemData = Repository[];
export const DataContext = createContext<HomeItemData>([]);
