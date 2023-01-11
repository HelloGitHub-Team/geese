import { NextPage } from 'next';

import ItemBottom from '@/components/home/ItemBottom';
import MDRender from '@/components/mdRender/MDRender';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import content from '../../../data/ats.md';

import { HelpPageProps } from '@/types/help';

const ATSPage: NextPage<HelpPageProps> = ({ content }) => {
  return (
    <>
      <Seo title='用户服务协议' />

      <div className='mt-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg '>
        <div className='mb-10 flex flex-col items-center px-2 text-4xl font-bold '>
          用户服务协议
        </div>
        <article>
          <MDRender className='max-w-none prose dark:prose-invert'>
            {content}
          </MDRender>
        </article>
        <ItemBottom endText='END'></ItemBottom>
      </div>
      <ToTop />
      <div className='h-4'></div>
    </>
  );
};

export default ATSPage;

export async function getStaticProps() {
  return {
    props: { content: content },
  };
}
