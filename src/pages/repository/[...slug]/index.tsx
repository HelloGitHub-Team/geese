import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import RepoDetailNavbar from '@/components/navbar/RepoNavbar';
import CommentContainer from '@/components/respository/CommentContainer';
import Info from '@/components/respository/Info';
import Tabs from '@/components/respository/Tabs';
import Seo from '@/components/Seo';

import { getDetail } from '@/services/repository';
import { getClientIP } from '@/utils/util';

import { Repository } from '@/types/repository';

interface Props {
  repo: Repository;
}

const RepositoryPage: NextPage<Props> = ({ repo }) => {
  const { t, i18n } = useTranslation('repository');

  const getLocalizedField = (field: any, fallback: any) =>
    i18n.language === 'en' ? field ?? fallback : fallback;

  return (
    <>
      <Seo
        title={`${repo.full_name}: ${getLocalizedField(
          repo.title_en,
          repo.title
        )}`}
        description={getLocalizedField(repo.summary_en, repo.summary)}
        image={repo.image_url ? repo.image_url : repo.author_avatar}
      />
      <RepoDetailNavbar
        avatar={repo.share_user.avatar}
        uid={repo.share_user.uid}
        t={t}
      />
      <div className='mt-2 bg-white px-2 pb-3 pt-2 dark:bg-gray-800 md:rounded-lg'>
        <Info repo={repo} t={t} i18n_lang={i18n.language} />
        <Tabs repo={repo} t={t} i18n_lang={i18n.language} />
      </div>
      <CommentContainer
        className='mt-2 bg-white dark:bg-gray-800 md:rounded-lg'
        belong='repository'
        belongId={repo.rid}
        t={t}
        i18n_lang={i18n.language}
      />
      <div className='h-8 lg:h-36' />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale,
}) => {
  const ip = getClientIP(req);
  // 在 [...slug] 路由中，slug 是一个数组
  const slug = query?.slug as string[];
  const identifier = slug?.join('/') || '';

  const data = await getDetail(ip, identifier);

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
