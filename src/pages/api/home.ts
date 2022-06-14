import { createContext } from 'react';

import { makeUrl } from '@/utils/api';
import { Repository } from '@/utils/types/repoType';

import { fetcher } from './base';

export interface HomeResponse {
  page: number;
  data: Repository[];
  has_more: boolean;
}

export const getItems = async (
  params?: Record<string, unknown>
): Promise<HomeResponse> => {
  const data = await fetcher<HomeResponse>(makeUrl(`/`, params));
  return data;
};

export type HomeItemData = Repository[];
export const DataContext = createContext<HomeItemData>([]);
