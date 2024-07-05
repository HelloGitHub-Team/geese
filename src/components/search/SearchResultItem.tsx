import Link from 'next/link';
import { NextPage } from 'next/types';
import { GoStar, GoVerified } from 'react-icons/go';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { SearchResultItemProps } from '@/types/search';

const SearchResultItem: NextPage<SearchResultItemProps> = ({ repo, index }) => {
  return (
    <article>
      <Link prefetch={false} href={`/repository/${repo.rid}`}>
        <div className='relative cursor-pointer bg-white px-2.5 py-3 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 md:px-4'>
          {/* 项目序号和标题 */}
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-gray-500 dark:text-gray-300'>
              <span className='truncate text-sm leading-snug  md:text-base'>
                {index + 1}
                <span className='pr-0.5'>.</span>
                {repo.title}
              </span>
              {/* 是否推荐 */}
              {repo.is_featured && (
                <div className='absolute top-0 right-0 flex items-center rounded-bl-md bg-yellow-500 bg-opacity-80 p-1 text-xs font-bold text-white'>
                  <GoStar className='mr-1' /> 推荐
                </div>
              )}
            </div>
          </div>
          {/* 项目描述 */}
          <div className='truncate pt-1 text-sm text-gray-400'>
            {repo.summary || '-'}
          </div>
          <div className='border border-red-700 flex items-center pt-2'>
            <img
              width='20'
              height='20'
              src={repo.author_avatar}
              className='bg-img h-5 w-5 rounded'
              alt='search_result_item'
            />
            {/* 作者头像、技术栈，时间 */}
            <div className='flex shrink grow items-center overflow-x-hidden text-sm text-gray-400 md:pl-1'>
              <div className='flex items-center truncate whitespace-nowrap md:max-w-xs'>
                <span className='hidden md:inline'>{repo.author}</span>
                <span className='px-1'>·</span>
                <div className='md:max-w-40 flex max-w-[120px] items-center truncate text-ellipsis md:w-fit'>
                  {repo.is_claimed && (
                    <GoVerified
                      className='mr-0.5 inline-block min-w-min align-[-2px] text-blue-500'
                      size={13}
                      aria-label='Verified item'
                    />
                  )}
                  <div className='truncate'>{repo.name}</div>
                </div>
              </div>
              <span className='px-1'>·</span>
              <span>
                <span
                  style={{ backgroundColor: repo.lang_color }}
                  className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                />
                <span className='whitespace-nowrap pl-0.5'>
                  {repo.primary_lang.split(' ')[0]}
                </span>
              </span>
              <span className='hidden md:inline'>
                <span className='px-1'>·</span>
                <time>{fromNow(repo.publish_at)}</time>
              </span>
            </div>
            {/* 项目 star 数 */}
            <div className='whitespace-nowrap pl-2 text-sm text-gray-400'>
              ✨Star {numFormat(repo.stars, 1, 1000)}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default SearchResultItem;
