import { NextPage } from 'next';

import Items from '@/components/layout/Items';
import Seo from '@/components/Seo';

import { HomeItemData } from '@/pages/api/home';

type IndexProps = {
  itemsData: HomeItemData;
  sortBy: string;
};

const Index: NextPage<IndexProps> = () => {
  return (
    <>
      <Seo templateTitle='Home' />
      <Seo />
      <Items></Items>
    </>
  );
};

export default Index;
