import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useLoginContext } from '@/hooks/useLoginContext';
import useRepositories from '@/hooks/useRepositories';

import ItemBottom from '@/components/home/ItemBottom';
import Items from '@/components/home/Items';
import Loading from '@/components/loading/Loading';
import { HomeSkeleton } from '@/components/loading/skeleton';
import IndexBar from '@/components/navbar/IndexBar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { indexRankBy, indexSortBy } from '@/utils/constants';

type QueryProps = {
  sort_by?: string;
  tid?: string;
  rank_by?: string;
  year?: number;
  month?: number;
};

const Index: NextPage = () => {
  const { t, i18n } = useTranslation('home');
  const router = useRouter();
  const {
    tid = 'all',
    sort_by = 'featured',
    rank_by = 'newest',
    year,
    month,
  }: QueryProps = router.query;
  const sortBy = indexSortBy.includes(sort_by) ? sort_by : 'featured';
  const rankBy = indexRankBy.includes(rank_by) ? rank_by : 'newest';

  const { isLogin } = useLoginContext();
  const { repositories, isValidating, hasMore, size, sentryRef } =
    useRepositories(sortBy, tid, rankBy, year, month);

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      return (
        <ItemBottom
          endText={isLogin ? t('bottom_text_login') : t('bottom_text_login')}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Seo title={t('title')} description={t('description')} />
      <IndexBar
        tid={tid}
        sortBy={sortBy}
        t={t}
        i18n_lang={i18n.language}
        rankBy={rankBy}
        year={year}
        month={month}
      />
      <div className='h-screen'>
        <Items repositories={repositories} i18n_lang={i18n.language} />
        <div
          className='divide-y divide-gray-100 overflow-hidden dark:divide-gray-700'
          ref={sentryRef}
        >
          {isValidating && size <= 1 && <HomeSkeleton loop={6} />}
          {(isValidating || hasMore) && size > 1 && <Loading />}
        </div>
        {handleItemBottom()}
        <div className='hidden border-none md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'home'])),
    },
  };
};

export default Index;
