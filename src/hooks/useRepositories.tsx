import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { HomeItem, HomeItems } from '@/types/home';

const useRepositories = (
  sort_by: string,
  tid: string | undefined,
  rank_by: string,
  year: number | undefined,
  month: number | undefined
) => {
  const buildParams = (index: number) => ({
    sort_by,
    page: index + 1,
    ...(rank_by && { rank_by }),
    ...(year && { year }), // 仅在year存在时添加
    ...(tid && { tid }), // 仅在tid存在时添加
    ...(month && { month }), // 仅在month存在时添加
  });

  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<HomeItems>(
      (index) => makeUrl(`/`, buildParams(index)),
      fetcher,
      { revalidateFirstPage: false }
    );

  // 根据 item_id 去重
  const repositories = data
    ? Array.from(
        new Map(
          data.flatMap((curr) =>
            curr.data.map((item) => [item.item_id, item] as [string, HomeItem])
          )
        ).values()
      )
    : [];

  const hasMore = data ? data[data.length - 1].has_more : false;
  const pageIndex = data ? size : 0;

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => {
      setSize(pageIndex + 1);
    },
    rootMargin: '0px 0px 100px 0px',
  });

  return { repositories, isValidating, hasMore, error, size, sentryRef };
};

export default useRepositories;
