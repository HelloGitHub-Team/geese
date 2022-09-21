import { NextPage } from 'next';

import Item from './Item';

import { HomeItem } from '@/types/home';
import { RepositoryItems } from '@/types/reppsitory';

const Items: NextPage<RepositoryItems> = ({ repositories }) => {
  return (
    <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
      {repositories.map((item: HomeItem, index: number) => (
        <Item key={item.item_id} item={item} index={index}></Item>
      ))}
    </div>
  );
};

export default Items;
