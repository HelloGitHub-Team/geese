import { NextPage } from 'next';
import { AiFillFire, AiOutlineEye } from 'react-icons/ai';
import { GoVerified } from 'react-icons/go';

import CustomLink from '@/components/links/CustomLink';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { ItemProps } from '@/types/home';

const Item: NextPage<ItemProps> = ({ item }) => {
  const {
    item_id,
    author_avatar,
    is_hot,
    is_claimed,
    name,
    title,
    comment_total,
    summary,
    author,
    lang_color,
    primary_lang,
    updated_at,
    clicks_total,
  } = item;

  if (!item_id || !name || !title) {
    console.warn('Missing essential item data:', item);
    return null;
  }

  return (
    <div className='overflow-hidden'>
      {' '}
      {/* 父容器防止溢出 */}
      <article className='transform rounded-lg shadow-lg transition-transform hover:scale-105'>
        <CustomLink
          href={`/repository/${item_id}`}
          aria-label={`Repository ${name}`}
        >
          <header className='relative cursor-pointer bg-white py-3 px-4 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
            <div className='flex w-full'>
              <figure className='mr-2.5 hidden md:block'>
                <img
                  width='75'
                  height='75'
                  src={author_avatar}
                  alt={`${author} avatar`}
                  className='block rounded'
                />
              </figure>
              <div className='relative flex w-full flex-col truncate'>
                <div className='flex flex-row pb-0.5'>
                  <h2 className='flex w-full items-center'>
                    <div className='flex flex-grow truncate text-base leading-snug'>
                      {is_hot && (
                        <AiFillFire
                          className='mr-0.5 inline-block align-[-2px]'
                          size={16}
                          style={{ color: 'rgb(226,17,12)' }}
                          aria-label='Hot item'
                        />
                      )}
                      <p className='mr-1 truncate text-sm font-normal first-letter:uppercase md:text-[15px]'>
                        <span className='font-semibold dark:text-white'>
                          {name}
                        </span>
                        <span className='mx-0.5 text-gray-500 opacity-40 dark:text-gray-300 md:mx-1'>
                          —
                        </span>
                        <span className='text-gray-600 dark:text-gray-300'>
                          {title}
                        </span>
                      </p>
                    </div>
                    <div className='shrink grow' />
                    <div className='justify-end'>
                      {comment_total > 0 && (
                        <div className='h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white dark:text-gray-100'>
                          {comment_total}
                        </div>
                      )}
                    </div>
                  </h2>
                </div>
                <div className='mt-0.5 truncate text-sm text-gray-400'>
                  {summary || '-'}
                </div>
                <div className='mt-1 flex items-center'>
                  <div className='flex grow items-center text-sm text-gray-400'>
                    <img
                      width='20'
                      height='20'
                      src={author_avatar}
                      alt={`${author} small avatar`}
                      className='mr-1 h-4 w-4 rounded-full md:hidden'
                    />
                    <div className='max-w-[6rem] truncate md:max-w-[10rem]'>
                      {is_claimed && (
                        <GoVerified
                          className='mr-0.5 inline-block align-[-2px] text-blue-500'
                          size={13}
                          aria-label='Verified item'
                        />
                      )}
                      {author}
                    </div>
                    <span className='pl-1 pr-1'>·</span>
                    <div className='flex items-center'>
                      <div
                        style={{ backgroundColor: lang_color }}
                        className='h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                      />
                      <div className='max-w-[5rem] truncate pl-0.5 md:max-w-[10rem]'>
                        {primary_lang}
                      </div>
                    </div>
                    <span className='pl-1 pr-1'>·</span>
                    <time dateTime={new Date(updated_at).toISOString()}>
                      {fromNow(updated_at)}
                    </time>
                  </div>
                  <div className='flex items-center text-sm text-gray-400'>
                    <AiOutlineEye aria-label='Views' />
                    <span className='ml-0.5'>
                      {numFormat(clicks_total, 1, 1000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </CustomLink>
      </article>
    </div>
  );
};

export default Item;
