import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ErrorPage from '@/components/layout/ErrorPage';
import Seo from '@/components/Seo';

const NotFoundPage: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Seo title='404' />
      <ErrorPage t={t} httpCode={404}></ErrorPage>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default NotFoundPage;
