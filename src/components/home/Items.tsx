import { NextPage } from 'next';
import React from 'react';

import ProjectItem from '../project/item';

import { HomeItem } from '@/types/home';
import { RepositoryItems } from '@/types/repository';

const Items: NextPage<RepositoryItems> = ({ repositories }) => {
  return (
    <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
      {repositories.map((item: HomeItem) => (
        // <Item key={item.item_id} item={item} />
        <ProjectItem
          key={item.item_id}
          item={item}
          showCommentCount
          showViewCount
          linkType='custom'
        />
      ))}
    </div>
  );
};

// 防止 Item 组件不必要的重渲染
export default React.memo(Items);
