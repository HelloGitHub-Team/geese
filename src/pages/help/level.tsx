import { NextPage } from 'next';

import ItemBottom from '@/components/home/ItemBottom';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import content from '../../../data/level.md';

import { HelpPageProps } from '@/types/help';

const RulePage: NextPage<HelpPageProps> = ({ content }) => {
  return (
    <>
      <Seo title='社区等级规则' />
      <Navbar middleText='社区等级' endText='介绍' />

      <div className='mt-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg '>
        <article>
          <MDRender className='prose max-w-none dark:prose-invert'>
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

export default RulePage;

export async function getStaticProps() {
  return {
    props: { content: content },
  };
}
