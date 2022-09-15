import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import { RepoModal } from '@/components/respository/Submit';

import { fetcher } from '@/services/base';
import { getTags } from '@/services/home';
import { makeUrl } from '@/utils/api';

import Item from './Item';
import ItemBottom from '../home/ItemBottom';
import TagLink from '../links/TagLink';
import ToTop from '../toTop/ToTop';

import { HomeItem, HomeItems } from '@/types/home';
import { Tag } from '@/types/tag';

const Items = () => {
  const router = useRouter();
  const { sort_by = 'hot', tid = '' } = router.query;

  const { isLogin } = useLoginContext();
  const [labelStatus, setLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [hotURL, setHotURL] = useState<string>('/?sort_by=hot');
  const [lastURL, setLastURL] = useState<string>('/?sort_by=last');

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

  const linkClassName = (sortName: string) =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700',
      {
        'text-slate-500 dark:text-slate-200': sort_by !== sortName,
        'bg-slate-100 dark:bg-slate-700 text-blue-500': sort_by === sortName,
      }
    );

  function labelClassName() {
    return classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700',
      {
        'text-slate-500 dark:text-slate-200': !labelStatus,
        'bg-slate-100 dark:bg-slate-700 dark:focus:bg-slate-700 text-blue-500':
          labelStatus,
      }
    );
  }

  const handleTags = useCallback(async () => {
    try {
      if (tagItems.length == 0) {
        const data = await getTags('hot');
        if (data?.data != undefined) {
          data.data.unshift({
            name: '全部',
            tid: '',
            repo_total: 0,
            created_at: '',
            udpated_at: '',
          });
          setTagItems(data.data);
        }
      }
    } catch (error) {
      console.log('error:' + error);
    }
  }, [tagItems, setTagItems]);

  const handleTagButton = () => {
    if (labelStatus) {
      setLabelStatus(false);
      if (sort_by == 'last') {
        router.push('/?sort_by=last');
      } else {
        router.push('/');
      }
    } else {
      setLabelStatus(true);
    }
  };

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      if (isLogin) {
        return <ItemBottom endText='你不经意间触碰到了底线'></ItemBottom>;
      } else {
        return <ItemBottom endText='到底啦！登录可查看更多内容'></ItemBottom>;
      }
    }
  };

  useEffect(() => {
    handleTags();
    if (tid) {
      setHotURL(`/?sort_by=hot&tid=${tid}`);
      setLastURL(`/?sort_by=last&tid=${tid}`);
      setLabelStatus(true);
    } else {
      setHotURL('/?sort_by=hot');
      setLastURL('/?sort_by=last');
      setLabelStatus(false);
    }
  }, [tid, handleTags]);

  return (
    <>
      <div className='relative bg-white dark:bg-gray-800'>
        <div className='my-2 overflow-hidden'>
          <div className='flex h-12 items-center justify-start space-x-2 py-2 px-4'>
            <Link href={hotURL}>
              <a className={linkClassName('hot')}>热门</a>
            </Link>

            <Link href={lastURL}>
              <a className={linkClassName('last')}>最近</a>
            </Link>

            <Button
              variant='ghost'
              onClick={handleTagButton}
              className={labelClassName()}
            >
              标签
            </Button>

            <div className='absolute top-0 right-0 p-2.5  md:hidden'>
              <RepoModal>
                <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white active:bg-blue-600'>
                  提交
                </a>
              </RepoModal>
            </div>
          </div>

          <div className={labelStatus ? 'flex pb-2.5 pl-4 pr-3' : 'hidden'}>
            <TagLink tagItems={tagItems}></TagLink>
          </div>
        </div>
      </div>
      <div className='h-screen divide-y divide-slate-100 dark:divide-slate-700'>
        {repositories.map((item: HomeItem, index) => (
          <Item key={item.item_id} item={item} index={index}></Item>
        ))}
        {(isValidating || hasMore) && (
          <div
            className='divide-y divide-slate-100 overflow-hidden dark:divide-slate-700'
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

export default Items;
