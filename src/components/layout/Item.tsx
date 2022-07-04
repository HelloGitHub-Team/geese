import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { RepositoryProps } from '@/utils/types/repoType';

const Item: NextPage<RepositoryProps> = ({ repo }) => {
  return (
    <article className='mx-4'>
      <Link href={`/repository/${repo.item_id}`}>
        <div className='hover-gray relative -mx-4 cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-slate-50'>
          <div className='pb-0.5'>
            <div className='text-color-primary flex justify-between visited:text-slate-500 dark:visited:text-slate-400'>
              <span className='truncate pt-1 text-base leading-snug'>
                {repo.title}
              </span>
              <span className='mt-1 ml-1 h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white'>
                {repo.comment_total}
              </span>
            </div>
          </div>
          <div className='truncate pt-1 text-sm text-slate-400'>
            {repo.description}
          </div>
          <div className='flex items-center pt-2'>
            <Link href={`/users/${repo.user.uid}`}>
              <Image
                width='20'
                height='20'
                src={repo.user.avatar}
                className='bg-img h-5 w-5 rounded'
                alt=''
              />
            </Link>
            <div className='flex shrink grow items-center overflow-x-hidden pl-2 text-sm text-slate-400'>
              <Link href={`/users/${repo.user.uid}`}>
                <div className='text-color-primary whitespace-nowrap hover:underline'>
                  {repo.user.nickname}
                </div>
              </Link>
              <span className='pl-1 pr-1'>·</span>
              <Link href='/users/322392455870869504'>
                <div className='text-color-primary whitespace-nowrap hover:underline'>
                  Python
                </div>
              </Link>
              <span className='pl-1 pr-1'>·</span>
              <time>2 小时前</time>
            </div>
            <div className='whitespace-nowrap pl-2 text-sm text-slate-400'>
              20 次查看
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Item;
