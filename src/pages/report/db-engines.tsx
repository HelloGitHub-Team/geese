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

import { getDBRank } from '@/services/rank';

import { RankPageProps } from '@/types/rank';

const DBEnginesPage: NextPage<RankPageProps> = ({
  year,
  month,
  monthList,
  list,
}) => {
  const { t, i18n } = useTranslation('rank');
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    if (key === 'month') {
      router.push(`/report/db-engines/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  // 排名	数据库	分数	对比上月	类型
  const columns: any[] = useMemo(
    () => [
      { key: 'position', title: t('db.thead.position'), width: 80 },
      { key: 'name', title: t('db.thead.name') },
      { key: 'rating', title: t('db.thead.rating') },
      {
        key: 'change',
        title: t('db.thead.change'),
        render: ChangeColumnRender,
      },
      { key: 'db_model', title: t('db.thead.model') },
    ],
    [i18n.language]
  );

  // 排名	数据库	流行度

  const md_columns: any[] = useMemo(
    () =>
      columns
        .map((col) => {
          if (col.key === 'position') {
            return { ...col, width: 60 };
          }
          if (col.key === 'rating') {
            return { ...col, width: 80 };
          }
          if (col.key === 'change') {
            return {
              ...col,
              title: t('db.thead.md_change'),
              render: TrendColumnRender,
              width: 60,
            };
          }
          if (col.key === 'db_model') {
            return null;
          }
          return col;
        })
        .filter(Boolean),
    [i18n.language]
  );

  return (
    <>
      <Seo title={t('db.title')} />
      {list ? (
        <div>
          <Navbar
            middleText={t('db.nav', {
              year: year,
              month: getMonthName(month, i18n.language, { forceEnglish: true }),
            })}
          />

          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='DB-Engines'
              logo='https://img.hellogithub.com/logo/db.jpg'
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
                  <Trans ns='rank' i18nKey='db.p_text' />
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
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const data = await getDBRank(ip, query['month'] as unknown as number);
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

export default DBEnginesPage;
