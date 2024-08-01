import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ItemBottom from '@/components/home/ItemBottom';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { HelpPageProps } from '@/types/help';

const RulePage: NextPage<HelpPageProps> = ({ content }) => {
  const { t } = useTranslation('help');

  return (
    <>
      <Seo title={t('level.title')} />
      <Navbar middleText={t('level.nav.middle')} endText={t('level.nav.end')} />

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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let content;
  if (locale === 'en') {
    content = await import('../../../data/level_en.md');
  } else {
    content = await import('../../../data/level.md');
  }
  content = content.default;
  return {
    props: {
      content,
      ...(await serverSideTranslations(locale as string, ['common', 'help'])),
    },
  };
};

export default RulePage;
