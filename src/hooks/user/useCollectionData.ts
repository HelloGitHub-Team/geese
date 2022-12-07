import useSWR from 'swr';

import Message from '@/components/message';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { FavoritesRes } from '@/types/reppsitory';

export default function useCollectionData(): {
  data?: FavoritesRes;
  mutate: any;
} {
  const { data, error, mutate } = useSWR<FavoritesRes>(
    makeUrl(`/favorites/`),
    fetcher
  );

  if (error) {
    Message.error(error.message || '获取收藏数据失败');
  }

  return { data, mutate };
}
