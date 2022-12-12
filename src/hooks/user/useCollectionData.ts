import { useState } from 'react';
import useSWR from 'swr';

import Message from '@/components/message';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { Page } from '@/types/help';
import { FavoritesRes } from '@/types/reppsitory';
import { CollectItem } from '@/types/user';

// 获取用户的收藏夹列表
export const useCollectionList = (
  uid: string
): {
  data?: FavoritesRes;
  mutate: any;
} => {
  const { data, error, mutate } = useSWR<FavoritesRes>(
    makeUrl(`/user/${uid}/favorites/`),
    fetcher
  );

  if (error) {
    Message.error(error.message || '获取收藏数据失败');
  }

  return { data, mutate };
};

// 获取指定收藏夹的项目列表
const useCollectionData = (uid: string, fid: string) => {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<Page<CollectItem>>(
    uid
      ? makeUrl(`/user/${uid}/favorite/${fid}/?page=${page}&pageSize=10`)
      : null,
    fetcher
  );
  console.log({ data, error });
  if (error) {
    Message.error(error.message || '获取收藏夹数据失败');
  }

  return {
    data,
    setPage,
  };
};
export default useCollectionData;
