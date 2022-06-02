import { createContext } from 'react';

import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface HomeItem {
  item_id: string;
  url: string;
  name: string;
  full_name: string;
  volume_name: string;
  title: string;
  period_desc: string;
  description: string;
  image_url: string;
  forks: number;
  stars: number;
  stars_str: string;
  open_issues: number;
  subscribers: number;
  primary_lang: string;
  lang_color: string;
  homepage: string;
  license: string;
  item_type: number;
  has_chinese: boolean;
  is_org: boolean;
  comment_total: number;
  tags: [];
  user: {
    uid: string;
    nickname: string;
    avatar: string;
  };
  repo_created_time: number;
  repo_created_at: string;
  repo_pushed_time: number;
  repo_pushed_at: string;
  repo_update_time: number;
  repo_update_at: string;
  created_at: string;
  updated_at: string;
  public_time: number;
}

export interface HomeResponse {
  page: number;
  data: HomeItem[];
  has_more: boolean;
}

export const makeHomeUrl = (params?: Record<string, unknown>) =>
  makeUrl(`/`, params);

export const getAllItems = async (
  params?: Record<string, unknown>
): Promise<HomeResponse> => fetcher<HomeResponse>(makeHomeUrl(params));

export type HomeItemData = HomeItem[];

export const DataContext = createContext<HomeItemData>([]);
