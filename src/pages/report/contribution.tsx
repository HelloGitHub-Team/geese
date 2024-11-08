import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo } from 'react';

import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import {
  getMonthName,
  RankSearchBar,
  RankTable,
} from '@/components/rankTable/RankTable';
import {
  ContributionColumnRender,
  LevelColumnRender,
  PositionColumnRender,
  UserColumnRender,
} from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getContributionRank } from '@/services/rank';
import { getClientIP } from '@/utils/util';

import { RankPageProps } from '@/types/rank';

const ContributionPage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const { t, i18n } = useTranslation('rank');
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    if (key === 'month') {
      router.push(`/report/contribution/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  // 排名	 用户	 等级  贡献值	 对比上月
  const columns: any[] = useMemo(
    () => [
      {
        key: 'position',
        title: t('contribution.thead.position'),
        render: PositionColumnRender,
        width: 80,
      },
      {
        key: 'name',
        title: t('contribution.thead.name'),
        render: UserColumnRender,
        width: 180,
      },
      {
        key: 'rating',
        title: t('contribution.thead.rating'),
        render: LevelColumnRender,
      },
      {
        key: 'change',
        title: t('contribution.thead.change'),
        render: ContributionColumnRender,
      },
      {
        key: 'total',
        title: t('contribution.thead.total'),
      },
    ],
    [i18n.language]
  );

  // 排名	 用户	 本月  贡献值
  const md_columns: any[] = useMemo(
    () =>
      columns
        .map((col) => {
          if (col.key === 'position') {
            return { ...col, width: 60 };
          }
          if (col.key === 'name') {
            return { ...col, width: 140 };
          }
          if (col.key === 'change') {
            return {
              ...col,
              title: t('contribution.thead.md_change'),
              render: ContributionColumnRender,
              width: 80,
            };
          }
          if (col.key === 'rating') {
            return null;
          }
          return col;
        })
        .filter(Boolean),
    [i18n.language]
  );

  return (
    <>
      <Seo title={t('contribution.title')} />
      {list ? (
        <div>
          <Navbar
            middleText={t('contribution.nav', {
              year: year,
              month: getMonthName(month, i18n.language, { forceEnglish: true }),
            })}
          />

          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='HelloGitHub'
              logo='https://img.hellogithub.com/logo/logo.png'
              i18n_lang={i18n.language}
              monthList={monthList}
              onChange={onSearch}
            />
            <div className='md:hidden'>
              <RankTable
                columns={md_columns}
                list={list}
                i18n_lang={i18n.language}
              />
            </div>
            <div className='hidden md:block'>
              <RankTable
                columns={columns}
                list={list}
                i18n_lang={i18n.language}
              />
            </div>
            <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <div className='whitespace-pre-wrap leading-8'>
                <p>
                  <Trans ns='rank' i18nKey='contribution.p_text' />
                </p>
              </div>
            </div>
            <div className='h-2' />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  locale,
}) => {
  const ip = getClientIP(req);
  const data = await getContributionRank(
    ip,
    query['month'] as unknown as number
  );
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        year: data.year,
        month: data.month,
        list: data.data,
        monthList: data.month_list,
        ...(await serverSideTranslations(locale as string, ['common', 'rank'])),
      },
    };
  }
};

export default ContributionPage;
