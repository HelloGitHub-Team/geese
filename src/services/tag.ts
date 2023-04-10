import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { BaseType } from '@/types/reppsitory';
import { SelectTagItems, TagItems, TagPage } from '@/types/tag';

export const getTagPageItems = async (
  ip: string,
  tid: string
): Promise<TagPage> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const data = await fetcher<TagPage>(makeUrl(`/tag/${tid}`), req);
  return data;
};

// 获取首页展示的标签
export const getTags = async (): Promise<TagItems> => {
  const result = await fetcher<TagItems>(makeUrl('/tag/'));
  return result;
};

// 获取所有标签并包含选择状态
export const getSelectTags = async (): Promise<SelectTagItems> => {
  const result = await fetcher<SelectTagItems>(makeUrl('/tag/select/'));
  return result;
};

export const saveSelectTags = async (tids: any) => {
  const result = await fetcher<BaseType>(makeUrl('/tag/select/save'), {
    method: 'POST',
    body: JSON.stringify({ tids: tids }),
  });
  return result;
};
