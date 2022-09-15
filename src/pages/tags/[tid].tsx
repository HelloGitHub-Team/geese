import { GetServerSideProps, NextPage } from 'next';

import Item from '@/components/home/Item';
import ItemBottom from '@/components/home/ItemBottom';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getTagPageItems } from '@/services/tag';

import { HomeItem } from '@/types/home';
import { TagPageProps } from '@/types/tag';

const TagPage: NextPage<TagPageProps> = ({ items, tag_name }) => {
  return (
    <>
      <Seo title={`标签 ${tag_name}`} />
      <Seo />
      <Navbar middleText={tag_name} endText='标签'></Navbar>

      <div className='h-screen divide-y divide-slate-100'>
        {items.map((item: HomeItem, index: number) => (
          <Item key={item.item_id} item={item} index={index}></Item>
        ))}
        <ItemBottom endText='你不经意间触碰到了底线'></ItemBottom>
        <div className='hidden md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const tid = query?.tid as string;
  const data = await getTagPageItems(tid);
  return {
    props: { items: data.data, tag_name: data.tag_name },
  };
};

export default TagPage;
