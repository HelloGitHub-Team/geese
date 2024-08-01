import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ItemBottom from '@/components/home/ItemBottom';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { HelpPageProps } from '@/types/help';

const ATSPage: NextPage<HelpPageProps> = ({ content }) => {
  const { t } = useTranslation('help');

  return (
    <>
      <Seo title={t('ats.title')} />
      <div className='mt-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg'>
        <div className='mb-10 flex flex-col items-center px-2 text-4xl font-bold'>
          {t('ats.title')}
        </div>
        <article className='whitespace-pre-line'>{content}</article>
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
    content = await import('../../../data/ats_en.md');
  } else {
    content = await import('../../../data/ats.md');
  }
  content = content.default;
  return {
    props: {
      content,
      ...(await serverSideTranslations(locale as string, ['common', 'help'])),
    },
  };
};

export default ATSPage;
