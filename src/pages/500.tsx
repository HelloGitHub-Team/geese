import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ErrorPage from '@/components/layout/ErrorPage';
import Seo from '@/components/Seo';

const ServerErrorPage: NextPage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Seo title='500' />
      <ErrorPage t={t} httpCode={500} />
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

export default ServerErrorPage;
