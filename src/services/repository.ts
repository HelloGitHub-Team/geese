import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { CommentData, Repository } from '@/types/reppsitory';

export const getDetail = async (rid: string): Promise<Repository> => {
  const data = await fetcher<Repository>(makeUrl(`/repository/detail/${rid}/`));
  return data;
};

export const submitComment = async (
  belongId: string,
  data: {
    comment: string;
    isUsed: boolean;
    score: number;
  }
) => {
  const url = makeUrl(`/v1/comment/repository/${belongId}`);
  const res = await fetcher<any>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
};

export const getComments = async (
  belong: string,
  belongId: string,
  page = 1,
  sortType = 'last'
) => {
  const url = makeUrl(
    `/v1/comment/${belong}/${belongId}?page=${page}&sort_by=${sortType}`
  );
  const res = await fetcher<CommentData>(url);
  return res;
};

// 点赞
export const like = async (
  belong: string,
  belongId: string,
  data: { item_id: string }
) => {
  const url = makeUrl(`/v1/vote/${belong}/${belongId}`);
  const res = await fetcher<any>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
};

// 取消点赞
export const unlike = async (id: string) => {
  const url = makeUrl(`/v1/vote/${id}`);
  const res = await fetcher<any>(url, {
    method: 'DELETE',
  });
  return res;
};
