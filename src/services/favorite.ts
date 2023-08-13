import Message from '@/components/message';

import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { BaseType, FavoriteRes } from '@/types/repository';

// 获取用户收藏夹列表
export const getFavoriteOptions = async (): Promise<FavoriteRes> => {
  const result = await fetcher<FavoriteRes>(makeUrl('/favorite/options/'));
  return result;
};

// 删除收藏夹
export const deleteFavorite = async (fid: string) => {
  const url = makeUrl(`/favorite/${fid}`);
  const result = await fetcher<{ success: boolean; message?: string }>(url, {
    method: 'DELETE',
  }).catch((err) => {
    Message.error(err.message || '删除失败');
    throw err;
  });
  return result;
};

// 新建收藏夹
export const addFavorite = async (params: {
  name: string;
  description: string;
}): Promise<BaseType> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'POST';
  data.body = JSON.stringify(params);
  const result = await fetcher<BaseType>(makeUrl('/favorite/'), data);
  return result;
};

// 编辑收藏夹
export const editFavorite = async (
  fid: string,
  params: { name: string; description: string; status: number }
): Promise<BaseType> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'PATCH';
  data.body = JSON.stringify(params);
  const result = await fetcher<BaseType>(makeUrl(`/favorite/${fid}`), data);
  return result;
};
