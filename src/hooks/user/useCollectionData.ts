import { useState } from 'react';
import useSWR from 'swr';

import Message from '@/components/message';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { Page } from '@/types/help';
import { CollectItem } from '@/types/user';

export default function useCollectionData(uid: string) {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<Page<CollectItem>>(
    uid ? makeUrl(`/user/${uid}/collection?page=${page}`) : null,
    fetcher
  );

  if (error) {
    Message.error(error.message || '获取收藏数据失败');
  }

  return {
    data,
    setPage,
  };
}
