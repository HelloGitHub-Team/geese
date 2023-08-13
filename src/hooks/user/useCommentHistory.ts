import { useState } from 'react';
import useSWR from 'swr';

import Message from '@/components/message';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { Page } from '@/types/help';
import { CommentItemData } from '@/types/repository';

export default function useCommentHistory(uid: string) {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<Page<CommentItemData>>(
    uid ? makeUrl(`/user/${uid}/comment/?page=${page}`) : null,
    fetcher
  );

  if (error) {
    Message.error(error.message || '获取评论数据失败');
  }

  return {
    data,
    setPage,
  };
}
