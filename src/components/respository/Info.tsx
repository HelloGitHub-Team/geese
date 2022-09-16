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
          <div className='w-full text-lg line-clamp-3 dark:text-slate-300 lg:text-2xl lg:line-clamp-2'>
            {repo.name}：{repo.title}
          </div>
          <div className='mt-1 mr-1 flex flex-wrap text-slate-500 dark:text-slate-400 lg:mr-2'>
            <div className='mt-1 hidden text-sm lg:mr-2 lg:block lg:text-base'>
              作者 {repo.author}
              <span className='pl-1 pr-1'>·</span>
              创建于 {format(repo.repo_created_at)}
            </div>
            {repo.volume_name ? (
              <Link href={`/periodical/volume/${Number(repo.volume_name)}`}>
                <div className='mt-1 mr-1 flex h-6 cursor-pointer items-center rounded border border-current px-2.5 text-xs font-medium hover:text-slate-700 dark:hover:text-slate-500 lg:mr-2'>
                  第 {repo.volume_name} 期
                </div>
              </Link>
            ) : (
              <></>
            )}

            {repo.tags.map((item) => (
              <Link href={`/tags/${item.tid}/`} key={item.tid}>
                <div className='mr-1 mt-1 flex h-6 cursor-pointer items-center rounded border border-current px-2.5 text-xs font-medium hover:text-slate-700 dark:hover:text-slate-500 lg:mr-2'>
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Score repo={repo}></Score>
    </div>
  );
};

export default Info;
