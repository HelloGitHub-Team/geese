import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import Item from '@/components/home/Item';
import Seo from '@/components/Seo';

import { getTagPageItems } from '@/services/tag';

import { HomeItem } from '@/types/home';
import { TagPageProps } from '@/types/tag';

const TagPage: NextPage<TagPageProps> = ({ items, tag_name }) => {
  const router = useRouter();

  return (
    <>
      <Seo title={`标签 ${tag_name}`} />
      <Seo />
      <div className='relative bg-white'>
        <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
          <div className='flex items-center justify-between bg-white px-2'>
            <div className='cursor-pointer py-2 pr-4' onClick={router.back}>
              <AiOutlineArrowLeft className='text-blue-400' size={20} />
            </div>
            <strong className='text-center'>{tag_name}</strong>
            <div className='justify-end text-sm text-gray-500'>标签</div>
          </div>
        </div>
      </div>

      <div className='bg-content h-screen divide-y divide-slate-100'>
        {items.map((item: HomeItem) => (
          <Item key={item.item_id} item={item}></Item>
        ))}
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
