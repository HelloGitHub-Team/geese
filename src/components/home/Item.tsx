import { NextPage } from 'next';
import { AiFillFire, AiOutlineEye } from 'react-icons/ai';

import CustomLink from '@/components/links/CustomLink';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { ItemProps } from '@/types/home';

const Item: NextPage<ItemProps> = ({ item }) => {
  return (
    <article>
      <CustomLink href={`/repository/${item.item_id}`}>
        <div className='relative cursor-pointer bg-white py-3 px-4 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
          <div className='flex w-full flex-row'>
            <div className='mr-2.5 hidden min-w-fit md:block'>
              <img
                width='70'
                height='70'
                src={item.author_avatar}
                className='bg-img block rounded bg-white'
              />
            </div>
            <div className='relative flex w-full flex-col truncate'>
              <div className='flex flex-row pb-0.5'>
                <div className='flex w-full shrink grow flex-row items-center'>
                  <div className='w-80 truncate text-base leading-snug md:w-96'>
                    {item.is_hot && (
                      <span className='text-center'>
                        <AiFillFire
                          className='mr-1 inline-block align-[-2px]'
                          size={16}
                          style={{ color: 'rgb(226,17,12)' }}
                        />
                      </span>
                    )}
                    {item.title}
                  </div>
                  <div className='shrink grow' />
                  <div className='justify-end'>
                    {item.comment_total ? (
                      <div className='h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white dark:text-gray-100'>
                        {item.comment_total}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className='mt-0.5 truncate text-sm text-gray-400'>
                {item.summary || '-'}
              </div>
              <div className='mt-1 flex items-center'>
                <div className='flex shrink grow items-center overflow-x-hidden text-sm text-gray-400'>
                  <img
                    width='20'
                    height='20'
                    src={`${item.author_avatar}!small`}
                    className='bg-img mr-1 h-5 w-5 rounded bg-white md:hidden'
                  />
                  <div className='max-w-[6rem] truncate whitespace-nowrap md:block md:max-w-[10rem]'>
                    {item.author}
                  </div>
                  <span className='pl-1 pr-1'>·</span>
                  <div className='flex flex-row items-center'>
                    <div
                      style={{ backgroundColor: `${item.lang_color}` }}
                      className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                    ></div>
                    <div className='max-w-[5rem] truncate whitespace-nowrap pl-0.5 md:max-w-[10rem]'>
                      {item.primary_lang}
                    </div>
                  </div>
                  <span className='pl-1 pr-1'>·</span>
                  <time>{fromNow(item.updated_at)}</time>
                </div>
                <div className='flex flex-row items-center text-sm text-gray-400'>
                  <AiOutlineEye />
                  <span className='ml-0.5'>
                    {numFormat(item.clicks_total, 1, 1000)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomLink>
    </article>
  );
};

export default Item;
