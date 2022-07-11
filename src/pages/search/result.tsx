import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import {
  SearchItemType,
  SearchResponse,
  SearchResultItemProps,
} from '@/typing/search';
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
            <div>loading...</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;

/**
 * 单个搜索结果展示组件
 * @param repo
 * @returns
 */
const SearchResultItem: NextPage<SearchResultItemProps> = ({ repo }) => {
  return (
    <article className='mx-4'>
      <Link href={`/repository/${repo.rid}`}>
        <div className='hover-gray relative -mx-4 cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-slate-50'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-slate-500 dark:visited:text-slate-400'>
              <span className='truncate pt-1 text-base leading-snug'>
                {repo.name}
              </span>
              <span className='mt-1 ml-1 h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white'>
                Star {repo.stars_str}
              </span>
            </div>
          </div>
          <div className='truncate pt-1 text-sm text-slate-400'>
            {repo.description}
          </div>
          <div className='flex items-center pt-2'>
            {/* <Link href={`/users/${repo.user.uid}`}>
              <Image
                width='20'
                height='20'
                src={repo.user.avatar}
                className='bg-img h-5 w-5 rounded'
                alt=''
              />
            </Link> */}
            {/* <div className='flex shrink grow items-center overflow-x-hidden pl-2 text-sm text-slate-400'>
              <Link href={`/users/${repo.user.uid}`}>
                <div className='text-color-primary whitespace-nowrap hover:underline'>
                  {repo.user.nickname}
                </div>
              </Link>
              <span className='pl-1 pr-1'>·</span>
              <Link href='/users/322392455870869504'>
                <div className='text-color-primary whitespace-nowrap hover:underline'>
                  Python
                </div>
              </Link>
              <span className='pl-1 pr-1'>·</span>
              <time>2 小时前</time>
            </div>
            <div className='whitespace-nowrap pl-2 text-sm text-slate-400'>
              20 次查看
            </div> */}
          </div>
        </div>
      </Link>
    </article>
  );
};
