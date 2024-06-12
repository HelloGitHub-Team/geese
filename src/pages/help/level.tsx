import { GetStaticProps, NextPage } from 'next';

import ItemBottom from '@/components/home/ItemBottom';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { HelpPageProps } from '@/types/help';

const RulePage: NextPage<HelpPageProps> = ({ content }) => {
  return (
    <>
      <Seo title='社区等级规则' />
      <Navbar middleText='社区等级' endText='介绍' />

      <div className='mt-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg'>
        <article>
          <MDRender className='prose max-w-none dark:prose-invert'>
            {content}
          </MDRender>
        </article>
        <ItemBottom endText='END' />
      </div>
      <ToTop />
      <div className='h-4' />
    </>
  );
};

export default RulePage;

export const getStaticProps: GetStaticProps = async () => {
  const content = await import('../../../data/level.md').then(
    (mod) => mod.default
  );
  return {
    props: { content },
  };
};
