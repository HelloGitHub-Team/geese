import { NextPage } from 'next';
import * as React from 'react';
import { useState } from 'react';

import { RepositoryProps } from '@/types/reppsitory';

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
      title: '代码',
      value: repo.primary_lang,
    },
    {
      title: '活跃',
      value: repo.is_active ? '是' : '否',
    },
    {
      title: '许可',
      value: repo.license || '无',
    },
    {
      title: '组织',
      value: repo.is_org || '无',
    },
    {
      title: 'Forks',
      value: repo.forks || '无',
    },
    {
      title: 'Issues',
      value: repo.open_issues,
    },
    {
      title: '订阅数',
      value: repo.subscribers,
    },
  ];

  return (
    <div className='relative mt-2'>
      <div
        className={`relative overflow-hidden rounded-lg ${
          isShowMore ? '' : 'h-[76px]'
        }`}
      >
        <div className='relative grid grid-cols-4 grid-rows-1 gap-3 rounded-lg bg-gray-100 py-3 text-center sm:grid-cols-5'>
          {infoList.map((item) => (
            <div key={item.title}>
              <div className='text-sm text-gray-600'>{item.title}</div>
              <div className='mt-1 overflow-hidden overflow-ellipsis text-lg font-bold text-gray-900'>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        hidden={isShowMore}
        className='absolute right-5 bottom-0 translate-y-full cursor-pointer rounded-b-lg bg-gray-100 px-4 py-1 text-xs text-gray-600 hover:bg-gray-200 active:bg-gray-100'
        onClick={() => setIsShowMore(true)}
      >
        更多
      </div>
    </div>
  );
};

export default MoreInfo;
