import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { useLoginContext } from '@/hooks/useLoginContext';

import ItemBottom from '@/components/home/ItemBottom';
import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import SearchResultItem from '@/components/search/SearchResultItem';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { SearchItemType, SearchResponse } from '@/types/search';

const Result: NextPage = () => {
  const router = useRouter();
  const { q = '' } = router.query;
  const { isLogin } = useLoginContext();

  // 根据路由参数 q 获取搜索结果
  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<SearchResponse>(
      (index) => (q ? makeUrl(`/search/`, { q, page: index + 1 }) : null),
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
      }
      return pre;
    }, []) || [];

  const hasMore = data ? data[data.length - 1].has_more : false;
  const pageIndex = data ? size : 0;

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      if (isLogin) {
        return <ItemBottom endText='以上就是搜索的全部内容'></ItemBottom>;
      } else {
        return <ItemBottom endText='到底啦！登录可获得更多内容'></ItemBottom>;
      }
    }
  };

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
      <div className='h-screen divide-y divide-slate-100 dark:divide-slate-700'>
        {list.map((item: SearchItemType) => (
          <SearchResultItem key={item.rid} repo={item} />
        ))}
        {(isValidating || hasMore) && (
          <div
            className='bg-content divide-y divide-slate-100 overflow-hidden dark:divide-slate-700'
            ref={sentryRef}
          >
            <Loading></Loading>
          </div>
        )}
        {handleItemBottom()}
        <div className='hidden md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export default Result;
