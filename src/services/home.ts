import { createContext } from 'react';

import { HomeItem, HomeItems, Stats } from '@/typing/home';
import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

export const getItems = async (
  params?: Record<string, unknown>
): Promise<HomeItems> => {
  const data = await fetcher<HomeItems>(makeUrl(`/`, params));
  return data;
};

export const getStats = async (): Promise<Stats> => {
  const data = await fetcher<Stats>(makeUrl(`/stats/`));
  return data;
};

export type HomeItemData = HomeItem[];
export const DataContext = createContext<HomeItemData>([]);
