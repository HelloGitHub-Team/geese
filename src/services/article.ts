import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { ArticleContentItem } from '@/types/article';

export const getArticleContent = async (
  aid: string,
  ip: string
): Promise<ArticleContentItem> => {
  const data: RequestInit = {};
  data.headers = { 'x-real-ip': ip };
  const result = await fetcher<ArticleContentItem>(
    makeUrl(`/article/${aid}`),
    data
  );
  return result;
};
