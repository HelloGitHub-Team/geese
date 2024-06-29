import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Item from './Item';

import { HomeItem } from '@/types/home';
import { RepositoryItems } from '@/types/repository';

const Items: NextPage<RepositoryItems> = ({ repositories }) => {
  const { i18n } = useTranslation('common');
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    router.push(router.pathname, router.pathname, { locale: lng });
  };

  return (
    <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
      <div>
        <button onClick={() => changeLanguage('zh')}>切换到中文</button>
        <button onClick={() => changeLanguage('en')}>Switch to English</button>
      </div>
      {repositories.map((item: HomeItem) => (
        <Item key={item.item_id} item={item} />
      ))}
    </div>
  );
};

// 防止 Item 组件不必要的重渲染
export default React.memo(Items);
