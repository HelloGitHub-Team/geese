import React from 'react';

import ProjectItem from '@/components/home/Item';

import { HomeItem } from '@/types/home';

type Props = {
  repositories: HomeItem[];
  i18n_lang: string;
};

const Items = ({ repositories, i18n_lang }: Props) => {
  return (
    <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
      {repositories.map((item: HomeItem) => (
        <ProjectItem
          key={item.item_id}
          item={item}
          showCommentCount
          showViewCount
          i18n_lang={i18n_lang}
        />
      ))}
    </div>
  );
};

// 防止 Item 组件不必要的重渲染
export default React.memo(Items);
