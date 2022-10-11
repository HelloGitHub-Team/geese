import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { ArticleContentItem } from '@/types/article';

export const getArticleContent = async (
  ip: string,
  aid: string
): Promise<ArticleContentItem> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };
  const result = await fetcher<ArticleContentItem>(
    makeUrl(`/article/${aid}`),
    req
  );
  return result;
};
