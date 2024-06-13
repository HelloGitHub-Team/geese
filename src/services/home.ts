import { createContext } from 'react';

import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { HomeItem, HomeItems, RecommendItems, Stats } from '@/types/home';
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

export const getRecommend = async (lid?: string): Promise<any> => {
  try {
    let url = '/repository/recommend/';
    if (lid) {
      url = `/repository/recommend/?lid=${lid}`;
    }
    const data = await fetcher<RecommendItems>(makeUrl(url));
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getTags = async (
  sort_by: string | string[]
): Promise<TagItems> => {
  const data = await fetcher<TagItems>(makeUrl(`/tag/`, { sort_by }));
  return data;
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

export const createFeedback = async (data: {
  content: string;
  selectOption: number;
  contact?: string;
}): Promise<any> => {
  const req: RequestInit = {};
  req.credentials = 'include';
  req.headers = {
    'Content-Type': 'application/json',
  };
  req.method = 'POST';
  req.body = JSON.stringify({
    content: data.content,
    cause: data.selectOption,
    contact: data.contact,
  });
  try {
    const result = await fetcher(makeUrl(`/feedback/`), req);
    return result;
  } catch (error) {
    console.error(error);
  }
};
export type HomeItemData = HomeItem[];
export const DataContext = createContext<HomeItemData>([]);
