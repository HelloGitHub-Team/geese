import { NextPage } from 'next';

import ItemBottom from '@/components/home/ItemBottom';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import content from '../../../data/onefile_join.md';

import { HelpPageProps } from '@/types/help';

const OneFileJoinPage: NextPage<HelpPageProps> = ({ content }) => {
  return (
    <>
      <Seo title='加入 OneFile 编程挑战' />
      <div className='relative pb-6'>
        <Navbar middleText='OneFile' endText='加入' />
        <div className='my-2 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='my-2'>
            <article>
              <MDRender className='prose max-w-none dark:prose-invert'>
                {content}
              </MDRender>
            </article>
            <ItemBottom endText='END'></ItemBottom>
          </div>
        </div>
        <ToTop />
        <div className='h-4'></div>
      </div>
    </>
  );
};

export default OneFileJoinPage;

export async function getStaticProps() {
  return {
    props: { content: content },
  };
}
