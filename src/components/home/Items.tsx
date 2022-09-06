import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import useToken from '@/hooks/useToken';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import { RepoModal } from '@/components/respository/Submit';

import { fetcher } from '@/services/base';
import { getTags } from '@/services/home';
import { makeUrl } from '@/utils/api';

import Item from './Item';
import TagLink from '../links/TagLink';
import Pagination from '../pagination/Pagination';
import ToTop from '../toTop/ToTop';

import { HomeItem, HomeItems } from '@/types/home';
import { Tag } from '@/types/tag';

const Items = () => {
  const router = useRouter();
  const { sort_by = 'hot', tid = '' } = router.query;

  const { token } = useToken();
  const [pageIndex, setPageIndex] = useState(1);
  const [labelStatus, setLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [hotURL, setHotURL] = useState<string>('/?sort_by=hot');
  const [lastURL, setLastURL] = useState<string>('/?sort_by=last');

  const { data, isValidating } = useSWR<HomeItems>(
    makeUrl(`/`, { sort_by, tid, page: pageIndex }),
    (key) => {
      const headers = { Authorization: `Bearer ${token}` };
      return fetcher(key, { headers });
    }
  );

  const linkClassName = (sortName: string) =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-slate-100 hover:text-blue-500',
      {
        'text-slate-500': sort_by !== sortName,
        'bg-slate-100 text-blue-500': sort_by === sortName,
      }
    );

  const labelClassName = () =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-slate-100 hover:text-blue-500',
      {
        'text-slate-500': !labelStatus,
        'bg-slate-100 text-blue-500': labelStatus,
      }
    );

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
    <div>
      <div className='relative bg-white'>
        <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
          <div className='flex py-2.5 pl-4 pr-3'>
            <div className='flex items-center justify-start space-x-2'>
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
          </div>
          <div className={labelStatus ? 'flex pb-2.5 pl-4 pr-3' : 'hidden'}>
            <TagLink tagItems={tagItems}></TagLink>
          </div>
        </div>
      </div>
      {isValidating ? (
        <Loading></Loading>
      ) : (
        <>
          <div className='bg-content h-screen divide-y divide-slate-100'>
            {data?.data.map((item: HomeItem, index: number) => (
              <Item key={item.item_id} item={item} index={index}></Item>
            ))}
            <div className='h-16 py-2 text-sm'>
              <Pagination
                total={data?.page_total as number}
                current={data?.page as number}
                onPageChange={setPageIndex}
                PreviousText='上一页'
                NextText='下一页'
              />
            </div>
          </div>
        </>
      )}
      <div className='hidden md:block'>
        <ToTop />
      </div>
    </div>
  );
};

export default Items;
