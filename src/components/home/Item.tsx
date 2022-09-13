import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { ItemProps } from '@/types/home';

import { DEFAULT_AVATAR } from '~/constants';

const Item: NextPage<ItemProps> = ({ item, index }) => {
  return (
    <article className='mx-4'>
      <Link href={`/repository/${item.item_id}`}>
        <div className='hover-gray relative -mx-4 cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-slate-50'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-slate-500 dark:visited:text-slate-400'>
              <span className='truncate pt-1 text-base leading-snug'>
                {index + 1}. {item.title}
              </span>
              <span className='mt-1 ml-1 h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white'>
                {item.comment_total}
              </span>
            </div>
          </div>
          <div className='truncate pt-1 text-sm text-slate-400'>
            {item.description}
          </div>
          <div className='flex items-center pt-2'>
            {item.author_avatar ? (
              <Image
                width='20'
                height='20'
                src={`https://img.hellogithub.com/github_avatar/${item.author_avatar}!small`}
                className='bg-img h-5 w-5 rounded'
                alt='github_avatar'
              />
            ) : (
              <Image
                width='20'
                height='20'
                src={DEFAULT_AVATAR}
                className='bg-img h-5 w-5 rounded'
                alt='github_avatar'
              />
            )}

            <div className='flex shrink grow items-center overflow-x-hidden text-sm text-slate-400 md:pl-1'>
              <div className='text-color-primary hidden cursor-auto truncate whitespace-nowrap md:block md:max-w-xs'>
                {item.author}
                <span className='pl-1 pr-1'>·</span>
                {item.name}
              </div>
              <span className='pl-1 pr-1'>·</span>
              <span>
                <span
                  style={{ backgroundColor: `${item.lang_color}` }}
                  className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px]'
                ></span>
                <span className='text-color-primary whitespace-nowrap pl-0.5'>
                  {item.primary_lang}
                </span>
              </span>
              <span className='pl-1 pr-1'>·</span>
              <time>{fromNow(item.updated_at)}</time>
            </div>
            <div className='whitespace-nowrap pl-2 text-sm text-slate-400'>
              {numFormat(item.clicks_total)} 次查看
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Item;
