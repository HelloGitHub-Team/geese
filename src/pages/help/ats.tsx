import { GetStaticProps, NextPage } from 'next';

import ItemBottom from '@/components/home/ItemBottom';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { HelpPageProps } from '@/types/help';

const ATSPage: NextPage<HelpPageProps> = ({ content }) => {
  return (
    <>
      <Seo title='用户服务协议' />
      <div className='mt-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg'>
        <div className='mb-10 flex flex-col items-center px-2 text-4xl font-bold'>
          用户服务协议
        </div>
        <article className='whitespace-pre-line'>{content}</article>
        <ItemBottom endText='END' />
      </div>
      <ToTop />
      <div className='h-4' />
    </>
  );
};

export default ATSPage;

export const getStaticProps: GetStaticProps = async () => {
  const content = await import('../../../data/ats.md').then(
    (mod) => mod.default
  );
  return {
    props: { content },
  };
};
