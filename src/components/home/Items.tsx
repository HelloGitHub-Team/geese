import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import { RepoModal } from '@/components/respository/Submit';

import { getItems } from '@/services/home';

import Item from './Item';
import TagLink from '../links/TagLink';
import Pagination from '../pagination/Pagination';
import ToTop from '../toTop/ToTop';

import { HomeItem } from '@/types/home';
import { TagType } from '@/types/tag';

const Items = () => {
  const router = useRouter();
  const { sort_by = 'hot', tid = '', page = 1 } = router.query;

  const [tagItems, setTagItems] = useState<TagType[]>([]);
  const [itemsData, setItemsData] = useState<HomeItem[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);

  const [isValidating, setIsValidating] = useState(true);
  const [labelStatus, setLabelStatus] = useState(false);
  const [hotURL, setHotURL] = useState<string>('/?sort_by=hot');
  const [lastURL, setLastURL] = useState<string>('/?sort_by=last');

  const onPageChange = (pageNum: number) => {
    setPageIndex(pageNum);
    const asPath = router.asPath;
    if (asPath.includes('page=')) {
      let url = `${router.basePath}?`;
      if (sort_by) {
        url += `sort_by=${sort_by}`;
      }
      if (tid) {
        url += `&tid=${tid}`;
      }
      if (pageNum > 1) {
        url += `&page=${pageNum}`;
      }
      router.push(url);
    } else if (asPath.includes('?')) {
      const url = `${asPath}&page=${pageNum}`;
      router.push(url);
    } else {
      const url = `${asPath}?page=${pageNum}`;
      router.push(url);
    }
  };

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

  const handleItems = useCallback(
    async (pageNum: number) => {
      try {
        setIsValidating(true);
        const data = await getItems({ sort_by, tid, page: pageNum });
        if (tagItems.length == 0) {
          setTagItems(data.tags);
        }
        setItemsData(data.data);
        setPageIndex(data.page);
        setPageTotal(data.page_total);
        setIsValidating(false);
      } catch (error) {
        console.log('error:' + error);
      }
    },
    [tagItems, setTagItems, tid, sort_by]
  );

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
    if (router.isReady) {
      if (tid) {
        setHotURL(`/?sort_by=hot&tid=${tid}`);
        setLastURL(`/?sort_by=last&tid=${tid}`);
        setLabelStatus(true);
      } else {
        setHotURL('/?sort_by=hot');
        setLastURL('/?sort_by=last');
        setLabelStatus(false);
      }
      if (Number(page) > 1) {
        handleItems(Number(page));
      } else {
        handleItems(1);
      }
    }
  }, [handleItems, router.isReady, page, tid, sort_by]);

  return (
    <div>
      <div className='relative bg-white'>
        <div className='bg-content mb-2 mt-2 overflow-hidden'>
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
            {itemsData.map((item: HomeItem, index: number) => (
              <Item key={item.item_id} item={item} index={index}></Item>
            ))}
            <div className='h-16 py-2 text-sm'>
              <Pagination
                total={pageTotal}
                current={pageIndex}
                onPageChange={onPageChange}
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
