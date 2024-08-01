import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import User from '@/components/user/User';

const UserIndexPage: NextPage = () => {
  return <User />;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'profile',
      ])),
    },
  };
};

export default UserIndexPage;
