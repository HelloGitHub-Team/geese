import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import Loading from '@/components/loading/Loading';
import SearchResultItem from '@/components/search/SearchResultItem';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { SearchItemType, SearchResponse } from '@/typing/search';
import { makeUrl } from '@/utils/api';

const Result: NextPage = () => {
  const router = useRouter();
  const { q = '' } = router.query;

  // 根据路由参数 q 获取搜索结果
  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<SearchResponse>(
      (index) => makeUrl(`/search`, { q, page: index + 1 }),
      fetcher,
      {
        revalidateFirstPage: false,
      }
    );

  // 追加搜索结果
  const list: SearchItemType[] =
    data?.reduce((pre: SearchItemType[], curr) => {
      if (curr.data.length > 0) {
        pre.push(...curr.data);
      }
      return pre;
    }, []) || [];

  const hasMore = data ? data[data.length - 1].has_more : false;
  const pageIndex = data ? size : 0;

  // 上拉加载更多
  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => {
      setSize(pageIndex + 1);
    },
    rootMargin: '0px 0px 100px 0px',
  });

  return (
    <>
      <Seo templateTitle='Search' />
      <div className='bg-content my-2 h-screen divide-y divide-slate-100'>
        {list.map((item: SearchItemType) => (
          <SearchResultItem key={item.rid} repo={item} />
        ))}
        {(isValidating || hasMore) && (
          <div
            className='bg-content divide-y divide-slate-100 overflow-hidden'
            ref={sentryRef}
          >
            <Loading></Loading>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;
