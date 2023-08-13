import { NextPage } from 'next';
import { useState } from 'react';

import { numFormat } from '@/utils/util';

import { RepositoryProps } from '@/types/repository';

const MoreInfo: NextPage<RepositoryProps> = ({ repo }) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const infoList = [
    {
      title: '星数',
      value: repo.stars_str,
    },
    {
      title: '中文',
      value: repo.has_chinese ? '是' : '否',
    },
    {
      title: '主语言',
      value: repo.primary_lang,
    },
    {
      title: '活跃',
      value: repo.is_active ? '是' : '否',
    },
    {
      title: '贡献者',
      value: repo.contributors ? numFormat(repo.contributors) : '无',
    },
    {
      title: 'Issues',
      value: numFormat(repo.open_issues),
    },
    {
      title: '组织',
      value: repo.is_org ? '是' : '否',
    },
    {
      title: '最新版本',
      value: repo.release_tag || '无',
    },
    {
      title: 'Forks',
      value: numFormat(repo.forks),
    },
    {
      title: '协议',
      value: repo.license || '无',
    },
  ];

  return (
    <div className='relative mt-1 mb-4'>
      <div
        className={`relative overflow-hidden rounded-lg ${
          isShowMore ? '' : 'h-20'
        }`}
      >
        <div className='relative grid grid-cols-4 grid-rows-1 gap-2 rounded-lg bg-gray-100 py-3 text-center dark:bg-gray-700 sm:grid-cols-5'>
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
      {!isShowMore ? (
        <div
          className='absolute right-3 bottom-0 translate-y-full cursor-pointer rounded-b-lg bg-gray-100 px-4 py-1 text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 lg:right-9'
          onClick={() => setIsShowMore(true)}
        >
          更多
        </div>
      ) : (
        <div
          className='absolute right-3 bottom-0 translate-y-full cursor-pointer rounded-b-lg bg-gray-100 px-4 py-1 text-xs text-gray-400 hover:bg-gray-200 active:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 lg:right-9'
          onClick={() => setIsShowMore(false)}
        >
          收起
        </div>
      )}
    </div>
  );
};

export default MoreInfo;
