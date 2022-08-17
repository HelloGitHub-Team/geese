import { NextPage } from 'next';
import Link from 'next/link';
import * as React from 'react';

import Score from '@/components/respository/Score';

import { format } from '@/utils/day';

import { RepositoryProps } from '@/types/reppsitory';

const Info: NextPage<RepositoryProps> = ({ repo }) => {
  return (
    <div className='flex-cloume flex '>
      <div className='max-h-full w-9/12 max-w-full'>
        <div className='relative h-full p-2'>
          <div className='w-full text-lg line-clamp-3 lg:text-2xl lg:line-clamp-2'>
            {repo.name}：{repo.title}
          </div>
          <div className='mt-1 flex flex-wrap text-gray-500'>
            <div className='mt-1 hidden text-sm lg:block lg:text-base'>
              作者 {repo.author}
              <span className='pl-1 pr-1'>·</span>
              创建于 {format(repo.repo_created_at)}
            </div>
            {repo.volume_name ? (
              <div className='mt-1 mr-1 flex h-6 cursor-pointer items-center rounded border border-current px-2.5 align-middle text-xs font-medium lg:mx-2'>
                第 {repo.volume_name} 期
              </div>
            ) : (
              <div></div>
            )}

            {repo.tags.map((item) => (
              <Link href={`/tags/${item.tid}/`} key={item.tid}>
                <div className='mr-1 mt-1 flex h-6 cursor-pointer items-center rounded border border-current px-2.5 text-xs font-medium hover:bg-blue-400 hover:text-white active:opacity-60 lg:mr-2'>
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Score></Score>
    </div>
  );
};

export default Info;
