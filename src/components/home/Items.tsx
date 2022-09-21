import { NextPage } from 'next';

import Item from './Item';

import { HomeItem } from '@/types/home';
import { RepositoryItems } from '@/types/reppsitory';

const Items: NextPage<RepositoryItems> = ({ repositories }) => {
  return (
    <div className='divide-y divide-gray-100 bg-white dark:divide-gray-700 md:overflow-hidden md:rounded-lg'>
      {repositories.map((item: HomeItem, index: number) => (
        <Item key={item.item_id} item={item} index={index}></Item>
      ))}
    </div>
  );
};

export default Items;
