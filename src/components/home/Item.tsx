import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { ItemProps } from '@/typing/home';
import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

const Item: NextPage<ItemProps> = ({ item }) => {
  const router = useRouter();
  return (
    <article className='mx-4'>
      <Link href={`/repository/${item.item_id}`}>
        <div className='hover-gray relative -mx-4 cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-slate-50'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-slate-500 dark:visited:text-slate-400'>
              <span className='truncate pt-1 text-base leading-snug'>
                {item.title}
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
            <Image
              width='20'
              height='20'
              src={item.user.avatar}
              className='bg-img h-5 w-5 rounded'
              alt=''
              onClick={() => router.push(`/users/${item.user.uid}`)}
            />
            <div className='flex shrink grow items-center overflow-x-hidden pl-2 text-sm text-slate-400'>
              <Link href={`/users/${item.user.uid}`}>
                <div className='text-color-primary whitespace-nowrap hover:underline'>
                  {item.user.nickname}
                </div>
              </Link>
              <span className='pl-1 pr-1'>·</span>
              <div className='text-color-primary whitespace-nowrap'>
                {item.primary_lang}
              </div>
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
