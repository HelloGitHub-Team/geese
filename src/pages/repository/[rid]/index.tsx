import { GetServerSideProps, NextPage } from 'next';

import RepoDetailNavbar from '@/components/navbar/RepoNavbar';
import CommentContainer from '@/components/respository/CommentContainer';
import Info from '@/components/respository/Info';
import Tabs from '@/components/respository/Tabs';
import Seo from '@/components/Seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getDetail } from '@/services/repository';

import { Repository } from '@/types/repository';
import { useTranslation } from 'next-i18next';

interface Props {
  repo: Repository;
}

const RepositoryPage: NextPage<Props> = ({ repo }) => {
  const { t, i18n } = useTranslation('repository');

  return (
    <>
      <Seo
        title={`${repo.full_name}: ${repo.title}`}
        description={repo.summary}
      />
      <RepoDetailNavbar
        avatar={repo.share_user.avatar}
        uid={repo.share_user.uid}
        t={t}
      />
      <div className='mt-2 bg-white px-2 pb-3 pt-2 dark:bg-gray-800 md:rounded-lg'>
        <Info repo={repo} t={t} />
        <Tabs repo={repo} t={t} />
      </div>
      <CommentContainer
        className='mt-2 bg-white dark:bg-gray-800 md:rounded-lg'
        belong='repository'
        belongId={repo.rid}
        t={t}
        i18n_lang={i18n.language}
      />
      <div className='h-8 lg:h-36'></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale,
}) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const rid = query?.rid as string;
  const data = await getDetail(ip, rid);
  if (data.success) {
    return {
      props: {
        ...(await serverSideTranslations(locale as string, [
          'common',
          'repository',
        ])),
        repo: data.data,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default RepositoryPage;
