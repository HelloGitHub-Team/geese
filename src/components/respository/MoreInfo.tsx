import { useState } from 'react';

import { numFormat } from '@/utils/util';

import { RepositoryProps } from '@/types/repository';

const MoreInfo = ({ repo, t }: RepositoryProps) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const infoList = [
    { title: t('more.star'), value: repo.stars_str },
    {
      title: t('more.chinese'),
      value: repo.has_chinese ? t('more.yes') : t('more.no'),
    },
    { title: t('more.language'), value: repo.primary_lang },
    {
      title: t('more.activity'),
      value: repo.is_active ? t('more.yes') : t('more.no'),
    },
    {
      title: t('more.contributors'),
      value: repo.contributors ? numFormat(repo.contributors) : t('more.null'),
    },
    { title: 'Issues', value: numFormat(repo.open_issues) },
    { title: t('more.org'), value: repo.is_org ? t('more.yes') : t('more.no') },
    { title: t('more.version'), value: repo.release_tag || t('more.null') },
    { title: 'Forks', value: numFormat(repo.forks) },
    { title: t('more.license'), value: repo.license || t('more.null') },
  ];

  return (
    <div className='relative mt-1 mb-4'>
      <div
        className={`relative overflow-hidden rounded-lg ${
          isShowMore ? '' : 'h-20'
        }`}
      >
        <div className='relative grid grid-cols-4 gap-2 rounded-lg bg-gray-100 py-3 text-center dark:bg-gray-700 sm:grid-cols-5'>
          {infoList.map((item) => (
            <div className='px-2' key={item.title}>
              <div className='relative mt-1 overflow-hidden whitespace-nowrap text-lg font-bold text-gray-900 dark:text-gray-200 lg:text-xl'>
                {item.value}
              </div>
              <div className='text-sm text-gray-400'>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div
        className='absolute right-3 bottom-0 translate-y-full cursor-pointer rounded-b-lg bg-gray-100 px-4 py-1 text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 lg:right-9'
        onClick={() => setIsShowMore(!isShowMore)}
      >
        {isShowMore ? t('more.collapse') : t('more.expand')}
      </div>
    </div>
  );
};

export default MoreInfo;
