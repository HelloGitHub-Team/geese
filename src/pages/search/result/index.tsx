import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { useLoginContext } from '@/hooks/useLoginContext';

import ItemBottom from '@/components/home/ItemBottom';
import Loading from '@/components/loading/Loading';
import { SearchSkeleton } from '@/components/loading/skeleton';
import Navbar from '@/components/navbar/Navbar';
import SearchResultItem from '@/components/project/item';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { SearchItemType, SearchResponse } from '@/types/search';

const Result: NextPage = () => {
  const router = useRouter();
  const { q = '' } = router.query;
  const { isLogin } = useLoginContext();

  const getKey = (index: number) =>
    q ? makeUrl(`/search/`, { q, page: index + 1 }) : null;

  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<SearchResponse>(getKey, fetcher, {
      revalidateFirstPage: false,
    });

  const list =
    data?.reduce(
      (pre: SearchItemType[], curr) => pre.concat(curr.data || []),
      []
    ) || [];
  const hasMore = data?.[data.length - 1]?.has_more || false;
  const pageIndex = data ? size : 0;

  const handleItemBottom = () => (
    <ItemBottom endText={isLogin ? 'END' : '到底啦！登录可获得更多内容'} />
  );

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => setSize(pageIndex + 1),
    rootMargin: '0px 0px 100px 0px',
  });

  return (
    <>
      <Seo
        title='开源项目搜索结果'
        description='找有趣、入门级的开源项目就上 HelloGitHub'
      />
      <Navbar middleText='搜索结果' />
      <div className='h-screen'>
        <div className='divide-y divide-gray-100 overflow-y-hidden bg-white dark:divide-gray-700 md:rounded-lg'>
          {list.map((item, index) => (
            <SearchResultItem key={item.rid} item={item} index={index} />
          ))}
        </div>
        {(isValidating || hasMore) && (
          <div
            className='bg-content divide-y divide-gray-100 overflow-hidden dark:divide-gray-700'
            ref={sentryRef}
          >
            {isValidating && size <= 1 ? <SearchSkeleton /> : <Loading />}
          </div>
        )}
        {!isValidating && !hasMore && handleItemBottom()}
        <div className='hidden border-none md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export default Result;
