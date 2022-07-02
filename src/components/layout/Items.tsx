import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';
import { Repository } from '@/utils/types/repoType';

import Item from './Item';

const Items = () => {
  const router = useRouter();
  const { sort_by = 'hot' } = router.query;

  const { data, error, setSize, isValidating, size } = useSWRInfinite<{
    data: Repository[];
    has_more: boolean;
    page: number;
  }>((index) => makeUrl(`/`, { sort_by, page: index + 1 }), fetcher, {
    revalidateFirstPage: false,
  });

  const repositories = data
    ? data.reduce((pre: Repository[], curr) => {
        if (curr.data.length > 0) {
          pre.push(...curr.data);
        }
        return pre;
      }, [])
    : [];
  const hasMore = data ? data[data.length - 1].has_more : false;
  const pageIndex = data ? size : 0;

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => {
      setSize(pageIndex + 1);
    },
    rootMargin: '0px 0px 400px 0px',
  });

  const linkClassName = (sortName: string) =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold  hover:bg-slate-100 hover:text-blue-500',
      {
        'text-slate-500': sort_by !== sortName,
        'bg-slate-100 text-blue-500': sort_by === sortName,
      }
    );

  return (
    <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
      <div className='relative bg-white'>
        <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
          <div className='flex py-2.5 pl-4 pr-3'>
            <div className='flex items-center justify-start space-x-2'>
              <Link href='/?sort_by=hot'>
                <a className={linkClassName('hot')}>热门</a>
              </Link>

              <Link href='/?sort_by=last'>
                <a className={linkClassName('last')}>最近</a>
              </Link>

              <div className='absolute top-0 right-0 p-2.5'>
                <Link href='/create/repo/'>
                  <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white active:bg-blue-600'>
                    提交
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className='bg-content divide-y divide-slate-100 overflow-scroll'
        style={{ height: 'calc(100vh - 180px)' }}
        ref={rootRef}
      >
        {repositories.map((item: Repository) => (
          <Item key={item.item_id} repo={item}></Item>
        ))}
        {(isValidating || hasMore) && (
          <div className='shrink grow lg:w-9/12 lg:grow-0' ref={sentryRef}>
            <div className='bg-content divide-y divide-slate-100 overflow-hidden'>
              <div>loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
