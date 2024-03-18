import Message from '@/components/message';

import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import {
  BaseType,
  CheckRepoRes,
  Collect,
  CommentData,
  CommentSuccessData,
  CreateRepoRes,
  RepositorySuccessData,
  UserActionStatus,
  Vote,
} from '@/types/repository';

export const getDetail = async (
  ip: string,
  rid: string
): Promise<RepositorySuccessData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };
  const result = await fetcher<RepositorySuccessData>(
    makeUrl(`/repository/detail/${rid}`),
    req
  );
  return result;
};

export const userRepoStatus = async (
  rid: string
): Promise<UserActionStatus> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'GET';
  const result = await fetcher<UserActionStatus>(
    makeUrl(`/user/action/status/`, { item_id: rid, item_type: 'repository' }),
    data
  );
  return result;
};

export const voteRepo = async (rid: string): Promise<Vote> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'POST';
  data.body = JSON.stringify({ belong_id: rid, belong: 'repository' });
  const result = await fetcher<Vote>(makeUrl('/vote/'), data);
  return result;
};

export const collectRepo = async (params: {
  fid: string;
  rid: string;
}): Promise<Collect> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'POST';
  data.body = JSON.stringify(params);
  const result = await fetcher<Collect>(makeUrl('/repository/collect/'), data);
  return result;
};

export const cancelVoteRepo = async (rid: string): Promise<BaseType> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'DELETE';
  data.body = JSON.stringify({ belong_id: rid, belong: 'repository' });
  const result = await fetcher<BaseType>(makeUrl('/vote/'), data);
  return result;
};

export const cancelCollectRepo = async (rid: string): Promise<BaseType> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.method = 'DELETE';
  data.body = JSON.stringify({ rid: rid });
  const result = await fetcher<BaseType>(makeUrl('/repository/collect/'), data);
  return result;
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
  const result = await fetcher<CommentSuccessData>(url, {
    method: 'POST',
    body: JSON.stringify({
      is_used: data.isUsed,
      score: data.score,
      comment: data.comment,
    }),
  });
  return result;
};

export const submitReplyComment = async (
  commentId: string,
  data: {
    comment: string;
    reply_id?: string;
  }
) => {
  const url = makeUrl(`/reply/${commentId}`);
  const result = await fetcher<CommentSuccessData>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result;
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
  const result = await fetcher<CommentData>(url);
  return result;
};

// 点赞
export const like = async (data: {
  belong: 'repository' | 'article';
  belongId: string;
  cid: string;
}) => {
  const url = makeUrl(`/vote/comment/`);
  const result = await fetcher<{ success: boolean; message?: string }>(url, {
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
  return result;
};

// 取消点赞
export const unlike = async (data: {
  belong: 'repository' | 'article';
  belongId: string;
  cid: string;
}) => {
  const url = makeUrl('/vote/comment/');
  const result = await fetcher<{ success: boolean; message?: string }>(url, {
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
  return result;
};

export const createRepo = async (params: Record<string, any>) => {
  const result = await fetcher<CreateRepoRes>(makeUrl('/repository/'), {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return result;
};

export const checkRepo = (url: string): Promise<CheckRepoRes> => {
  return fetcher<CheckRepoRes>(makeUrl(`/repository/check/?url=${url}`));
};
