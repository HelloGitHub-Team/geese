import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { ArticleContentItem, OneItemResp, OneItemsResp } from '@/types/article';

export const getArticleContent = async (
  ip: string,
  aid: string,
  locale: string
): Promise<ArticleContentItem> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };
  const result = await fetcher<ArticleContentItem>(
    makeUrl(`/article/${aid}`, { lang: locale }),
    req
  );
  return result;
};

export const getOnefileContent = async (
  ip: string,
  oid: string
): Promise<OneItemResp> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };
  const result = await fetcher<OneItemResp>(makeUrl(`/onefile/${oid}`), req);
  return result;
};

export const getOnefile = async (ip: string): Promise<OneItemsResp> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };
  const result = await fetcher<OneItemsResp>(makeUrl(`/onefile/`), req);
  return result;
};
