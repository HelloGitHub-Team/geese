import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import Loading from '@/components/loading/Loading';
import Message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import SearchResultItem from '@/components/search/SearchResultItem';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { SearchItemType, SearchResponse } from '@/types/search';

const Result: NextPage = () => {
  const router = useRouter();
  const { q = '' } = router.query;

  // 根据路由参数 q 获取搜索结果
  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<SearchResponse>(
      (index) => (q ? makeUrl(`/search`, { q, page: index + 1 }) : null),
      fetcher,
      {
        revalidateFirstPage: false,
      }
    );

  // 追加搜索结果
  const list: SearchItemType[] =
    data?.reduce((pre: SearchItemType[], curr) => {
      if (curr.data?.length > 0) {
        pre.push(...curr.data);
      } else {
        Message.info('搜索结果为空');
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
      <Navbar middleText='搜索结果'></Navbar>
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
