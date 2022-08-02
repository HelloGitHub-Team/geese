import { useCallback, useEffect, useState } from 'react';

import log from '@/lib/log';

import { getComments } from '@/services/repository';

import { CommentItemData } from '@/types/reppsitory';

function useCommentList({
  belong,
  belongId,
}: {
  belong: string;
  belongId: string;
}) {
  const [list, setList] = useState<CommentItemData[]>([]);
  const [total, setTotal] = useState(0);
  const [currentUserComment, setCurrentUserComment] =
    useState<CommentItemData | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortType, setSortType] = useState('last');

  const fetchData = useCallback(
    async (sortType = 'last') => {
      try {
        const data = await getComments(belong, belongId, 1, sortType);
        setList(data.data);
        setTotal(data.total);
        setCurrentUserComment(data.user_comment);
        setPage(data.page);
        setHasMore(data.has_more);
        setSortType(sortType);
      } catch (err) {
        log.error(err);
      }
    },
    [belong, belongId]
  );

  const sortBy = (type: 'last' | 'hot') => {
    fetchData(type);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await getComments(belong, belongId, nextPage);
    setPage(nextPage);
    setList([...list, ...data.data]);
    setHasMore(data.has_more);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    list,
    total,
    currentUserComment,
    page,
    hasMore,
    loadMore,
    setList,
    refreshList: fetchData,
    sortBy,
    sortType,
  };
}

export default useCommentList;
