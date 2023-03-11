import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';

import TagLink from '@/components/links/TagLink';
import { RepoModal } from '@/components/respository/Submit';

import { getTags } from '@/services/home';

import { Tag } from '@/types/tag';

interface Props {
  tid: string;
  sort_by: string;
}

const IndexBar = (props: Props) => {
  const router = useRouter();

  const [labelStatus, setLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [hotURL, setHotURL] = useState<string>('/?sort_by=hot');
  const [lastURL, setLastURL] = useState<string>('/?sort_by=last');

  const handleTags = useCallback(async () => {
    try {
      if (tagItems.length == 0) {
        const data = await getTags('rank');
        if (data?.data != undefined) {
          data.data.unshift({
            name: '全部',
            tid: '',
            icon_name: '',
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
      if (props.sort_by == 'hot') {
        router.push('/?sort_by=hot');
      } else {
        router.push('/');
      }
    } else {
      setLabelStatus(true);
    }
  };

  const linkClassName = (sortName: string) =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-200': props.sort_by !== sortName,
        'bg-gray-100 dark:bg-gray-700 text-blue-500':
          props.sort_by === sortName,
      }
    );

  function labelClassName() {
    return classNames(
      'lg:hidden flex h-8 cursor-pointer items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 focus:bg-white dark:text-gray-200': !labelStatus,
        'bg-gray-100 dark:bg-gray-700 dark:focus:bg-gray-700 text-blue-500':
          labelStatus,
      }
    );
  }

  useEffect(() => {
    handleTags();
    if (props.tid) {
      setHotURL(`/?sort_by=hot&tid=${props.tid}`);
      setLastURL(`/?sort_by=last&tid=${props.tid}`);
      setLabelStatus(true);
    } else {
      setHotURL('/?sort_by=hot');
      setLastURL('/?sort_by=last');
      setLabelStatus(false);
    }
  }, [props.tid, handleTags]);

  return (
    <div className='relative my-2 overflow-hidden bg-white dark:bg-gray-800 md:rounded-lg'>
      <div className='flex h-12 shrink grow items-center justify-start space-x-1 py-2 px-4 md:space-x-2'>
        <Link href={lastURL}>
          <a className={linkClassName('last')}>最新</a>
        </Link>
        <Link href={hotURL}>
          <a className={linkClassName('hot')}>热门</a>
        </Link>
        <span onClick={handleTagButton} className={labelClassName()}>
          标签
        </span>
        <div className='shrink grow'></div>
        <div className='md:hidden'>
          <RepoModal>
            <a className='flex h-8 items-center rounded-lg bg-blue-500 px-3 text-xs text-white active:bg-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:active:bg-gray-900 sm:px-4'>
              提交
            </a>
          </RepoModal>
        </div>
        <div className='hidden md:block'>
          <RepoModal>
            <button className='flex h-8 cursor-pointer items-center rounded-lg bg-blue-500 px-2 text-sm text-white active:bg-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-blue-500 dark:active:bg-gray-900 xl:px-2'>
              <div className='flex items-center'>
                <AiOutlineGithub size={16} className='mr-0.5' />
                提交项目
              </div>
            </button>
          </RepoModal>
        </div>
      </div>
      <div className={labelStatus ? 'flex px-4 pb-2.5 lg:hidden' : 'hidden'}>
        <TagLink items={tagItems} tid={props.tid} sort_by={props.sort_by} />
      </div>
    </div>
  );
};

export default IndexBar;
