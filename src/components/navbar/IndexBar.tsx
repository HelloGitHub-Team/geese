import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import Button from '@/components/buttons/Button';
import TagLink from '@/components/links/TagLink';
import { RepoModal } from '@/components/respository/Submit';

import { getTags } from '@/services/home';

import { Tag } from '@/types/tag';

const IndexBar = () => {
  const router = useRouter();
  const { sort_by = 'hot', tid = '' } = router.query;

  const [labelStatus, setLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [hotURL, setHotURL] = useState<string>('/?sort_by=hot');
  const [lastURL, setLastURL] = useState<string>('/?sort_by=last');

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

  const linkClassName = (sortName: string) =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-200': sort_by !== sortName,
        'bg-gray-100 dark:bg-gray-700 text-blue-500': sort_by === sortName,
      }
    );

  function labelClassName() {
    return classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700',
      {
        'text-gray-500 focus:bg-white dark:text-gray-200': !labelStatus,
        'bg-gray-100 dark:bg-gray-700 dark:focus:bg-gray-700 text-blue-500':
          labelStatus,
      }
    );
  }

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
    <div className='relative my-2 overflow-hidden bg-white dark:bg-gray-800 md:rounded-lg'>
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
        <div className='shrink grow'></div>
        <div className='md:hidden'>
          <RepoModal>
            <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white active:bg-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:active:bg-gray-900'>
              提交
            </a>
          </RepoModal>
        </div>
      </div>

      <div className={labelStatus ? 'flex px-4 pb-2.5' : 'hidden'}>
        <TagLink tagItems={tagItems}></TagLink>
      </div>
    </div>
  );
};

export default IndexBar;
