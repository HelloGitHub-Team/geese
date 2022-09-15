import Message from '@/components/message';

import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import {
  BaseType,
  Collect,
  CommentData,
  CommentSuccessData,
  CreateRepoRes,
  Repository,
  UserActionStatus,
  Vote,
} from '@/types/reppsitory';

export const getDetail = async (rid: string): Promise<Repository> => {
  const data = await fetcher<Repository>(makeUrl(`/repository/detail/${rid}`));
  return data;
};

export const userRepoStatus = async (
  rid: string
): Promise<UserActionStatus> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'POST';
  data.body = JSON.stringify({ item_id: rid, item_type: 'repository' });
  const result = await fetcher<UserActionStatus>(
    makeUrl(`/user/action/status/`),
    data
  );
  return result;
};

export const voteRepo = async (rid: string): Promise<Vote> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'POST';
  data.body = JSON.stringify({ belong_id: rid, belong: 'repository' });
  const resp = await fetcher<Vote>(makeUrl('/vote/'), data);
  return resp;
};

export const collectRepo = async (rid: string): Promise<Collect> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'POST';
  data.body = JSON.stringify({ rid: rid });
  const resp = await fetcher<Collect>(makeUrl('/repository/collect/'), data);
  return resp;
};

export const cancelVoteRepo = async (rid: string): Promise<BaseType | null> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'DELETE';
  data.body = JSON.stringify({ belong_id: rid, belong: 'repository' });
  const resp = await fetcher<BaseType>(makeUrl('/vote/'), data);
  return resp;
};

export const cancelCollectRepo = async (
  rid: string
): Promise<BaseType | null> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'DELETE';
  data.body = JSON.stringify({ rid: rid });
  const resp = await fetcher<BaseType>(makeUrl('/repository/collect/'), data);
  return resp;
};

// 记录 github 访问次数 /v1/repository/go/github/
export const recordGoGithub = async (rid: string): Promise<any> => {
  try {
    await fetcher(makeUrl(`/repository/go/github/?rid=${rid}`));
  } catch (error) {
    console.error(error);
  }
};

export const submitComment = async (
  belongId: string,
  data: {
    comment: string;
    isUsed: boolean;
    score: number;
  }
) => {
  const url = makeUrl(`/comment/repository/${belongId}`);
  const res = await fetcher<CommentSuccessData>(url, {
    method: 'POST',
    body: JSON.stringify({
      is_used: data.isUsed,
      score: data.score,
      comment: data.comment,
    }),
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
    `/comment/${belong}/${belongId}?page=${page}&sort_by=${sortType}`
  );
  const res = await fetcher<CommentData>(url);
  return res;
};

// 点赞
export const like = async (data: {
  belong: 'repository' | 'article';
  belongId: string;
  cid: string;
}) => {
  const url = makeUrl(`/vote/comment/`);
  const res = await fetcher<{ success: boolean; message?: string }>(url, {
    method: 'POST',
    body: JSON.stringify({
      belong: data.belong,
      belong_id: data.belongId,
      cid: data.cid,
    }),
  }).catch((err) => {
    Message.error(err.message || '点赞失败');
    throw err;
  });
  return res;
};

// 取消点赞
export const unlike = async (data: {
  belong: 'repository' | 'article';
  belongId: string;
  cid: string;
}) => {
  const url = makeUrl('/vote/comment/');
  const res = await fetcher<{ success: boolean; message?: string }>(url, {
    method: 'DELETE',
    body: JSON.stringify({
      belong: data.belong,
      belong_id: data.belongId,
      cid: data.cid,
    }),
  }).catch((err) => {
    Message.error(err.message || '取消点赞失败');
    throw err;
  });
  return res;
};

export const createRepo = (
  params: Record<string, any>
): Promise<CreateRepoRes> => {
  return fetcher<CreateRepoRes>(makeUrl('/repository/'), {
    method: 'POST',
    body: JSON.stringify(params),
  });
};
