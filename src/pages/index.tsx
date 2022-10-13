import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { useLoginContext } from '@/hooks/useLoginContext';

import Items from '@/components/home/Items';
import Loading from '@/components/loading/Loading';
import IndexBar from '@/components/navbar/IndexBar';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { HomeItem, HomeItems } from '@/types/home';

//#region  //*=========== 动态加载,以提高首次加载速度 ===========
const ItemBottom = dynamic(() => import('@/components/home/ItemBottom'));
const ToTop = dynamic(() => import('@/components/toTop/ToTop'));
//#endregion  //*=======动态加载,以提高首次加载速度=  ===========

const Index: NextPage = () => {
  const router = useRouter();
  const { sort_by = 'last', tid = '' } = router.query;

  const { isLogin } = useLoginContext();
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

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      if (isLogin) {
        return <ItemBottom endText='你不经意间触碰到了底线'></ItemBottom>;
      } else {
        return <ItemBottom endText='到底啦！登录可查看更多内容'></ItemBottom>;
      }
    }
  };

  return (
    <>
      <Seo />
      <IndexBar />
      <div className='h-screen'>
        <Items repositories={repositories}></Items>
        {(isValidating || hasMore) && (
          <div
            className='divide-y divide-gray-100 overflow-hidden dark:divide-gray-700'
            ref={sentryRef}
          >
            <Loading></Loading>
          </div>
        )}
        {handleItemBottom()}
        <div className='hidden border-none md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export default Index;
