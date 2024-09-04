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
  ChangeColumnRender,
  TrendColumnRender,
} from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getNetcraftRank } from '@/services/rank';
import { getClientIP, numFormat } from '@/utils/util';

import { NetcraftRankPageProps, RankDataItem } from '@/types/rank';

const NetcraftPage: NextPage<NetcraftRankPageProps> = ({
  year,
  month,
  monthList,
  all_list,
  active_list,
}) => {
  const { t, i18n } = useTranslation('rank');
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    if (key === 'month') {
      router.push(`/report/netcraft/?month=${value}`);
    }
    if (key === 'target') {
      router.push(`${value}`);
    }
  };

  const serverList = [
    { title: 'Apache', key: 'apache' },
    { title: 'Nginx', key: 'nginx' },
    { title: 'OpenResty', key: 'openresty' },
  ].map((server) => ({
    ...server,
    content: t(`netcraft.servers.${server.key}`),
  }));

  // 排名	服务器	市场占比	对比上月	总数
  const columns: any[] = useMemo(
    () => [
      { key: 'position', title: t('netcraft.thead.position'), width: 80 },
      { key: 'name', title: t('netcraft.thead.name') },
      {
        key: 'rating',
        title: t('netcraft.thead.rating'),
      },
      {
        key: 'change',
        title: t('netcraft.thead.change'),
        render: ChangeColumnRender,
        percent: true,
      },
      {
        key: 'total',
        title: t('netcraft.thead.total'),
        render: (row: RankDataItem) => {
          return <div>{numFormat(row.total, 2, 10000)}</div>;
        },
      },
    ],
    [i18n.language]
  );

  // 排名	服务器	市场占比 趋势
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
              title: t('netcraft.thead.md_change'),
              render: TrendColumnRender,
              width: 60,
            };
          }
          if (col.key === 'total') {
            return null;
          }
          return col;
        })
        .filter(Boolean),
    [i18n.language]
  );

  return (
    <>
      <Seo title={t('netcraft.title')} />
      {all_list ? (
        <div>
          <Navbar
            middleText={t('netcraft.nav', {
              year: year,
              month: getMonthName(month, i18n.language, { forceEnglish: true }),
            })}
          />

          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='Netcraft'
              logo='https://img.hellogithub.com/logo/netcraft.jpg'
              monthList={monthList}
              i18n_lang={i18n.language}
              onChange={onSearch}
            />
            <div className='md:hidden'>
              <div className='pb-1 text-center text-sm font-semibold dark:text-gray-300'>
                {t('netcraft.market_title')}
              </div>
              <RankTable
                columns={md_columns}
                list={all_list}
                i18n_lang={i18n.language}
              />
              <div className='pt-2 pb-1 text-center text-sm font-semibold dark:text-gray-300'>
                {t('netcraft.active_title')}
              </div>
              <RankTable
                columns={md_columns}
                list={active_list}
                i18n_lang={i18n.language}
              />
            </div>
            <div className='hidden md:block'>
              <div className='pb-1 text-center text-sm font-semibold dark:text-gray-300'>
                {t('netcraft.market_title')}
              </div>
              <RankTable
                columns={columns}
                list={all_list}
                i18n_lang={i18n.language}
              />
              <div className='pt-2 pb-1  text-center text-sm font-semibold dark:text-gray-300'>
                {t('netcraft.active_title')}
              </div>
              <RankTable
                columns={columns}
                list={active_list}
                i18n_lang={i18n.language}
              />
            </div>
            <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <div className='whitespace-pre-wrap leading-8'>
                <p>
                  <Trans ns='rank' i18nKey='netcraft.p_text' />
                </p>
              </div>
              <ul className='list-disc pl-4'>
                {serverList.map((server) => {
                  return (
                    <li key={server.title} className='list-item leading-loose'>
                      <b>{server.title}：</b>
                      {server.content}
                    </li>
                  );
                })}
              </ul>
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
  const data = await getNetcraftRank(ip, query['month'] as unknown as number);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        year: data.year,
        month: data.month,
        all_list: data.all_data,
        active_list: data.active_data,
        monthList: data.month_list,
        ...(await serverSideTranslations(locale as string, ['common', 'rank'])),
      },
    };
  }
};

export default NetcraftPage;
