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
          <div className='flex flex-wrap text-gray-500'>
            <div className='mt-1 hidden text-sm lg:block lg:text-base'>
              由 {repo.author} 创建于 {format(repo.repo_created_at)}
            </div>
            <div className='mt-1 mr-1 rounded border border-current px-2.5 py-0.5 align-middle text-xs font-medium lg:mx-2'>
              Vol.{repo.volume_name}
            </div>
            {repo.tags.map((item) => (
              <Link href={`/?sort_by=hot&tid=${item.tid}`} key={item.tid}>
                <div className='mr-1 mt-1 rounded border border-current px-2.5 py-0.5 text-xs font-medium lg:mr-2'>
                  <a>{item.name}</a>
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
