import Link from 'next/link';
import { NextPage } from 'next/types';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { SearchResultItemProps } from '@/types/search';

/**
 * 单个搜索结果展示组件
 * @param repo
 * @returns
 */
const SearchResultItem: NextPage<SearchResultItemProps> = ({ repo, index }) => {
  return (
    <article>
      <Link href={`/repository/${repo.rid}`}>
        <div className='relative cursor-pointer bg-white py-3 px-4 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-gray-500 dark:text-gray-300'>
              <span className='truncate pt-1 text-base leading-snug'>
                {index + 1}. {repo.title}
              </span>
            </div>
          </div>
          <div className='truncate pt-1 text-sm text-gray-400'>
            {repo.summary || '-'}
          </div>
          <div className='flex items-center pt-2'>
            <img
              width='20'
              height='20'
              src={repo.author_avatar}
              className='bg-img h-5 w-5 rounded'
              alt='search_result_item'
            />
            <div className='flex shrink grow items-center overflow-x-hidden text-sm text-gray-400 md:pl-1'>
              <div className='hidden truncate whitespace-nowrap md:block md:max-w-xs'>
                {repo.author}
                <span className='pl-1 pr-1'>·</span>
                {repo.name}
              </div>
              <span className='pl-1 pr-1'>·</span>
              <span>
                <span
                  style={{ backgroundColor: `${repo.lang_color}` }}
                  className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                ></span>
                <span className='whitespace-nowrap pl-0.5'>
                  {repo.primary_lang}
                </span>
              </span>
              <span className='pl-1 pr-1'>·</span>
              <time>{fromNow(repo.last_pushed_at)}</time>
            </div>
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
