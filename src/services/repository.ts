import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { BaseType, Repository, CommentData, Vote, VoteStatus } from '@/types/reppsitory';

export const getDetail = async (rid: string): Promise<Repository> => {
  const data = await fetcher<Repository>(makeUrl(`/repository/detail/${rid}/`));
  return data;
};

export const voteRepoStatus = async (rid: string): Promise<VoteStatus> => {
  const data: RequestInit = {};
  data.headers = {
    Authorization: `Bearer ${window.localStorage.getItem('Authorization')}`,
  };
  const result = await fetcher<VoteStatus>(
    makeUrl(`/vote/repository/${rid}/status/`),
    data
  );
  return result;
};

export const voteRepo = async (rid: string): Promise<Vote> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.localStorage.getItem('Authorization')}`,
  };
  data.method = 'POST';
  data.body = JSON.stringify({ belong_id: rid, belong: 'repository' });
  const resp = await fetcher<Vote>(makeUrl('/vote/'), data);
  return resp;
};

export const cancelVoteRepo = async (rid: string): Promise<BaseType | null> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.localStorage.getItem('Authorization')}`,
  };
  data.method = 'DELETE';
  data.body = JSON.stringify({ belong_id: rid, belong: 'repository' });
  const resp = await fetcher<BaseType>(makeUrl('/vote/'), data);
  return resp;
};

// 记录 github 访问次数 /v1/repository/go/github/
export const recordGoGithub = async (rid: string): Promise<any> => {
  try {
    await fetcher(makeUrl(`/repository/go/github/?rid=${rid}`));
  } catch (error) {
    console.error(error);
  }
export const submitComment = async (
  belongId: string,
  data: {
    comment: string;
    isUsed: boolean;
    score: number;
  }
) => {
  const url = makeUrl(`/comment/repository/${belongId}`);
  const res = await fetcher<any>(url, {
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
  const url = makeUrl(`/vote/comment`);
  const res = await fetcher<{ success: boolean; message?: string }>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
};

// 取消点赞
export const unlike = async (data: {
  belong: 'repository' | 'article';
  belongId: string;
  cid: string;
}) => {
  const url = makeUrl(`/vote/comment`);
  const res = await fetcher<{ success: boolean; message?: string }>(url, {
    method: 'DELETE',
    body: JSON.stringify(data),
  });
  return res;
};
