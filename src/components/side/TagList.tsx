import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineAppstore, AiOutlineCloseSquare } from 'react-icons/ai';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import Loading from '../loading/Loading';

import { Tag, TagItems } from '@/types/tag';

export default function TagList() {
  const router = useRouter();
  const { tid = '' as string } = router.query;

  const { data, isValidating } = useSWRImmutable<TagItems>(
    makeUrl('/tag/', { pageSize: 15, sort_by: 'rank' }),
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const tags = data?.success ? data.data : [];

  const iconClassName = (iconName: string) =>
    classNames(`iconfont icon-${iconName} mr-1`);

  const tagClassName = (itemTid: string) =>
    classNames(
      'flex flex-row w-[112px] items-center my-1 py-2 px-3 rounded text-[14px] cursor-pointer hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-400': tid !== itemTid,
        'bg-gray-100 dark:bg-gray-700 text-blue-500': tid == itemTid,
      }
    );

  return (
    <div className='hidden max-w-[162px] shrink-0 lg:block lg:w-2/12  lg:grow-0'>
      <div className='fixed top-16 pl-3'>
        <div className='rounded-lg bg-white px-3 pt-2 pb-0.5 dark:bg-gray-800'>
          <div className='px-1 pb-1'>
            <div className='border-b border-b-gray-200 pb-2 dark:border-b-gray-600 dark:text-gray-300'>
              <Link href='/?sort_by=last'>
                {tid.length > 0 ? (
                  <div className='flex w-[104px] cursor-pointer flex-row items-center rounded p-1 hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700'>
                    <AiOutlineCloseSquare size={16} />
                    <div className='ml-1 font-medium'>取消选择</div>
                  </div>
                ) : (
                  <div className='flex w-[104px] flex-row items-center p-1'>
                    <AiOutlineAppstore size={16} />
                    <div className='ml-1 font-medium'>热门标签</div>
                  </div>
                )}
              </Link>
            </div>
          </div>
          {!isValidating ? (
            <div>
              {tags.map((item: Tag) => (
                <Link key={item.tid} href={`/?sort_by=last&tid=${item.tid}`}>
                  <div className={tagClassName(item.tid)}>
                    <div className={iconClassName(item.icon_name)}></div>
                    <div className='truncate text-ellipsis'>{item.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
}
