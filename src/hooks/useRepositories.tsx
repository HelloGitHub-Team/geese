import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { HomeItem, HomeItems } from '@/types/home';

const useRepositories = (sort_by: string, tid: string) => {
  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<HomeItems>(
      (index) => makeUrl(`/`, { sort_by, tid, page: index + 1 }),
      fetcher,
      { revalidateFirstPage: false }
    );

  const repositories = data
    ? data.reduce((pre: HomeItem[], curr) => {
        if (curr.data.length > 0) {
          pre.push(...curr.data);
        }
        return pre;
      }, [])
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
