import { NextPage } from 'next';

import Item from './Item';

import { HomeItem } from '@/types/home';
import { RepositoryItems } from '@/types/reppsitory';

const Items: NextPage<RepositoryItems> = ({ repositories }) => {
  return (
    <div className='divide-y divide-slate-100 overflow-y-hidden rounded-lg bg-white dark:divide-slate-700'>
      {repositories.map((item: HomeItem, index: number) => (
        <Item key={item.item_id} item={item} index={index}></Item>
      ))}
    </div>
  );
};

export default Items;
