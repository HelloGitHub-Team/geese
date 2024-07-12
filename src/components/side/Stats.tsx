import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { numFormat } from '@/utils/util';

import { StatsSkeleton } from '../loading/skeleton';

import { SideProps, Stats } from '@/types/home';

export default function SiteStats({ t }: SideProps) {
  const { data: stats } = useSWRImmutable<Stats>(makeUrl('/stats/'), fetcher);

  return (
    <div className='space-y-1.5 rounded-lg bg-white px-3 py-2.5 dark:bg-gray-800'>
      {stats ? (
        <div className='flex flex-wrap border-b border-b-gray-300 pb-2 dark:border-b-gray-700 lg:pb-3'>
          <div className='flex-1 pr-4'>
            <div className='whitespace-nowrap text-sm text-gray-400 lg:text-base'>
              {t('site_stats.user')}
            </div>
            <div className='text-2xl dark:text-gray-300 lg:text-3xl'>
              {numFormat(stats?.user_total, 1, 10000)}
            </div>
          </div>
          <div className='flex-1'>
            <div className='whitespace-nowrap text-sm text-gray-400 lg:text-base'>
              {t('site_stats.repo')}
            </div>
            <div className='text-2xl dark:text-gray-300 lg:text-3xl'>
              {numFormat(stats?.repo_total, 1, 10000)}
            </div>
          </div>
        </div>
      ) : (
        <StatsSkeleton />
      )}

      <div className='text-base text-gray-400'>{t('site_stats.title')}</div>
      <div className='text-sm dark:text-gray-300 lg:leading-7'>
        {t('site_stats.desc')}
      </div>
    </div>
  );
}
