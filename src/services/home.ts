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
    makeUrl(`/tag/`, { page: 1, pageSize: 10, sort_by })
  );
  return data;
};

export const recordGoAdvert = async (aid: string): Promise<any> => {
  try {
    await fetcher(makeUrl(`/go/advert/?aid=${aid}`));
  } catch (error) {
    console.error(error);
  }
};

export const redirectRecord = async (
  target: string,
  item_id: string,
  redirect_type: string
): Promise<any> => {
  const req: RequestInit = {};
  req.credentials = 'include';
  req.headers = {
    'Content-Type': 'application/json',
  };
  req.method = 'POST';
  req.body = JSON.stringify({
    target: target,
    item_id: item_id,
    redirect_type: redirect_type,
  });
  try {
    await fetcher(makeUrl(`/redirect/`), req);
  } catch (error) {
    console.error(error);
  }
};

export type HomeItemData = HomeItem[];
export const DataContext = createContext<HomeItemData>([]);
