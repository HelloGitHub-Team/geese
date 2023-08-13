import { useState } from 'react';
import useSWR from 'swr';

import Message from '@/components/message';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { Page } from '@/types/help';
import { FavoriteRes } from '@/types/repository';
import { CollectItem } from '@/types/user';

// 获取用户的收藏夹列表
export const useFavoriteList = (
  uid: string
): {
  data?: FavoriteRes;
  mutate: any;
} => {
  const { data, error, mutate } = useSWR<FavoriteRes>(
    makeUrl(`/user/${uid}/favorite/`),
    fetcher
  );

  if (error) {
    Message.error(error.message || '获取收藏数据失败');
  }
  return { data, mutate };
};

// 获取指定收藏夹的项目列表
export const useCollectionData = (uid: string, fid: string) => {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<Page<CollectItem>>(
    uid
      ? makeUrl(`/user/${uid}/favorite/${fid}?page=${page}&pageSize=10`)
      : null,
    fetcher
  );
  if (error) {
    Message.error(error.message || '获取收藏夹数据失败');
  }

  return {
    data,
    setPage,
  };
};
