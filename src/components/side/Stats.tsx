import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { numFormat } from '@/utils/util';

import { StatsSkeleton } from '../loading/skeleton';

import { Stats } from '@/types/home';

export default function SiteStats() {
  const { data: stats } = useSWRImmutable<Stats>(makeUrl('/stats/'), fetcher);

  return (
    <div className='space-y-1.5 rounded-lg bg-white px-3 py-2.5 dark:bg-gray-800'>
      {stats ? (
        <div className='flex flex-wrap border-b border-b-gray-300 pb-3 dark:border-b-gray-700'>
          <div className='flex-1 pr-4'>
            <div className='whitespace-nowrap text-sm text-gray-400 lg:text-base'>
              用户总数
            </div>
            <div className='text-2xl dark:text-gray-300 lg:text-3xl'>
              {numFormat(stats?.user_total, 1, 10000)}
            </div>
          </div>
          <div className='flex-1'>
            <div className='whitespace-nowrap text-sm text-gray-400 lg:text-base'>
              开源项目
            </div>
            <div className='text-2xl dark:text-gray-300 lg:text-3xl'>
              {numFormat(stats?.repo_total, 1, 10000)}
            </div>
          </div>
        </div>
      ) : (
        <StatsSkeleton />
      )}

      <div className='text-base text-gray-400'>关于本站</div>
      <div className='text-sm leading-7 dark:text-gray-300'>
        HelloGitHub 是一个发现和分享有趣、入门级开源项目的平台。
        希望大家能够在这里找到编程的快乐、 轻松搞定问题的技术方案、
        大呼过瘾的开源神器， 顺其自然地开启开源之旅。
      </div>
    </div>
  );
}
