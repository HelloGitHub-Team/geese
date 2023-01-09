import { NextPage } from 'next';

import CustomLink from '@/components/links/CustomLink';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { ItemProps } from '@/types/home';

const Item: NextPage<ItemProps> = ({ item, index }) => {
  return (
    <article>
      <CustomLink href={`/repository/${item.item_id}`}>
        <div className='relative cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-gray-500 dark:text-gray-300'>
              <span className='truncate pt-1 text-base leading-snug'>
                {index + 1}. {item.title}
              </span>
              <span className='mt-1 ml-1 h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white dark:text-gray-100'>
                {item.comment_total}
              </span>
            </div>
          </div>
          <div className='truncate pt-1 text-sm text-gray-400'>
            {item.description || '-'}
          </div>
          <div className='flex items-center pt-2'>
            <img
              width='20'
              height='20'
              src={item.author_avatar}
              className='bg-img h-5 w-5 rounded'
            />
            <div className='flex shrink grow items-center overflow-x-hidden text-sm text-gray-400 md:pl-1'>
              <div className='hidden truncate whitespace-nowrap md:block md:max-w-xxs'>
                {item.author}
                <span className='pl-1 pr-1'>·</span>
                {item.name}
              </div>
              <span className='pl-1 pr-1'>·</span>
              <span>
                <span
                  style={{ backgroundColor: `${item.lang_color}` }}
                  className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                ></span>
                <span className='whitespace-nowrap pl-0.5'>
                  {item.primary_lang}
                </span>
              </span>
              <span className='pl-1 pr-1'>·</span>
              <time>{fromNow(item.updated_at)}</time>
            </div>
            <div className='whitespace-nowrap pl-2 text-sm text-gray-400'>
              {numFormat(item.clicks_total, 2, 10000)} 次查看
            </div>
          </div>
        </div>
      </CustomLink>
    </article>
  );
};

export default Item;
