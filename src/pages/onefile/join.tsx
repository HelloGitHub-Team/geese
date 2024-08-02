import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ItemBottom from '@/components/home/ItemBottom';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { HelpPageProps } from '@/types/help';

const OneFileJoinPage: NextPage<HelpPageProps> = ({ content }) => {
  const { t } = useTranslation('onefile');

  return (
    <>
      <Seo title={t('join.title')} />
      <div className='relative pb-6'>
        <Navbar middleText='OneFile' endText={t('join.nav')} />
        <div className='my-2 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='my-2'>
            <article>
              <MDRender className='prose max-w-none dark:prose-invert'>
                {content}
              </MDRender>
            </article>
            <ItemBottom endText='END' />
          </div>
        </div>
        <ToTop />
        <div className='h-4' />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let content;
  if (locale === 'en') {
    content = await import('../../../data/onefile_en.md');
  } else {
    content = await import('../../../data/onefile.md');
  }
  content = content.default;
  return {
    props: {
      content,
      ...(await serverSideTranslations(locale as string, [
        'common',
        'onefile',
      ])),
    },
  };
};

export default OneFileJoinPage;
