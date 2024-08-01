import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo } from 'react';

import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import RankTable, {
  getMonthName,
  RankSearchBar,
} from '@/components/rankTable/RankTable';
import {
  ChangeColumnRender,
  TrendColumnRender,
} from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getTiobeRank } from '@/services/rank';
import { getClientIP } from '@/utils/util';

import { RankPageProps } from '@/types/rank';

const TiobePage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const { t, i18n } = useTranslation('rank');
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    if (key === 'month') {
      router.push(`/report/tiobe/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  // 排名	编程语言	流行度	对比上月	年度明星语言
  const columns: any[] = useMemo(
    () => [
      { key: 'position', title: t('tiobe.thead.position'), width: 80 },
      { key: 'name', title: t('tiobe.thead.name') },
      { key: 'rating', title: t('tiobe.thead.rating') },
      {
        key: 'change',
        title: t('tiobe.thead.change'),
        render: ChangeColumnRender,
        percent: true,
      },
      { key: 'star', title: t('tiobe.thead.star') },
    ],
    [i18n.language]
  );

  // 排名	编程语言	流行度
  const md_columns: any[] = useMemo(
    () =>
      columns
        .map((col) => {
          if (col.key === 'position') {
            return { ...col, width: 60 };
          }
          if (col.key === 'change') {
            return {
              ...col,
              title: t('tiobe.thead.md_change'),
              render: TrendColumnRender,
              width: 60,
            };
          }
          if (col.key === 'star') {
            return null;
          }
          return col;
        })
        .filter(Boolean),
    [i18n.language]
  );

  return (
    <>
      <Seo title={t('tiobe.title')} />
      {list ? (
        <div>
          <Navbar
            middleText={t('tiobe.nav', {
              year: year,
              month: getMonthName(month, i18n.language, { forceEnglish: true }),
            })}
          />
          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='TIOBE'
              logo='https://img.hellogithub.com/logo/tiobe.png!small'
              i18n_lang={i18n.language}
              monthList={monthList}
              onChange={onSearch}
            />
            <div className='md:hidden'>
              <RankTable columns={md_columns} list={list} />
            </div>
            <div className='hidden md:block'>
              <RankTable columns={columns} list={list} />
            </div>
            <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <div className='whitespace-pre-wrap leading-8'>
                <p>
                  <Trans ns='rank' i18nKey='tiobe.p_text' />
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
  const data = await getTiobeRank(ip, query['month'] as unknown as number);
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

export default TiobePage;
