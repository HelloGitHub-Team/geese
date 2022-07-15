import { createContext } from 'react';

import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { HomeItem, HomeItems, Stats } from '@/types/home';
import { TagItems } from '@/types/tag';

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

export const getTags = async (
  sort_by: string | string[]
): Promise<TagItems> => {
  const data = await fetcher<TagItems>(
    makeUrl(`/tag/search/`, { page: 1, page_size: 10, sort_by, asc: 0 })
  );
  return data;
};

export type HomeItemData = HomeItem[];
export const DataContext = createContext<HomeItemData>([]);
