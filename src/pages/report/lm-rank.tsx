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
import { RatingWithTrendRender } from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getLMArenaRank } from '@/services/rank';
import { getClientIP } from '@/utils/util';

import { LMArenaRankPageProps } from '@/types/rank';

// 类别名称映射
const getCategoryName = (category: string, lang: string) => {
  const categoryMap: Record<string, { en: string; zh: string }> = {
    text: { en: 'Text', zh: '文本' },
    webdev: { en: 'WebDev', zh: '网页开发' },
    vision: { en: 'Vision', zh: '视觉' },
    'text-to-image': { en: 'Text to Image', zh: '文生图' },
    'text-to-video': { en: 'Text to Video', zh: '文生视频' },
  };
  return categoryMap[category]?.[lang === 'en' ? 'en' : 'zh'] || category;
};

const LMRankPage: NextPage<LMArenaRankPageProps> = ({
  year,
  month,
  monthList,
  category,
  categoryList,
  list,
}) => {
  const { t, i18n } = useTranslation('rank');
  const router = useRouter();

  const onSearch = (key: string, value: string) => {
    const currentQuery = { ...router.query };
    if (key === 'month') {
      currentQuery.month = value;
    }
    if (key === 'target') {
      router.push(`${value}`);
      return;
    }
    router.push({
      pathname: '/report/lm-rank',
      query: currentQuery,
    });
  };

  const onCategoryChange = (opt: { key: string; value: string }) => {
    const currentQuery = { ...router.query };
    currentQuery.category = opt.key;
    router.push({
      pathname: '/report/lm-rank',
      query: currentQuery,
    });
  };

  // 类别选项
  const categoryOptions = useMemo(() => {
    return categoryList?.map((cat) => ({
      key: cat,
      value: getCategoryName(cat, i18n.language),
    }));
  }, [categoryList, i18n.language]);

  // 根据最长模型名称计算宽度
  const maxNameWidth = useMemo(() => {
    if (!list?.length) return 200;
    const maxLen = Math.max(...list.map((item) => item.name?.length || 0));
    // 每个字符约 8px，最小 120px，最大 360px
    return Math.min(Math.max(maxLen * 8, 120), 380);
  }, [list, category]);

  // 表格列配置
  const columns: any[] = useMemo(
    () => [
      { key: 'position', title: t('lmrank.thead.position'), width: 80 },
      { key: 'name', title: t('lmrank.thead.name'), width: maxNameWidth },
      {
        key: 'rating',
        title: t('lmrank.thead.rating'),
        render: RatingWithTrendRender,
        width: 120,
      },
      {
        key: 'organization',
        title: t('lmrank.thead.organization'),
        width: 140,
      },
    ],
    [i18n.language, maxNameWidth]
  );

  // 移动端列配置（分数和趋势合并为一列）
  const md_columns: any[] = useMemo(
    () => [
      { key: 'position', title: t('lmrank.thead.position'), width: 60 },
      { key: 'name', title: t('lmrank.thead.name') },
      {
        key: 'rating',
        title: t('lmrank.thead.rating'),
        render: RatingWithTrendRender,
        width: 80,
      },
    ],
    [i18n.language]
  );

  return (
    <>
      <Seo title={t('lmrank.title')} />
      {list ? (
        <div>
          <Navbar
            middleText={t('lmrank.nav', {
              year: year,
              month: getMonthName(month, i18n.language, { forceEnglish: true }),
            })}
          />
          <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
            <RankSearchBar
              title='LMArena'
              logo='https://img.hellogithub.com/logo/lmarena.png!small'
              i18n_lang={i18n.language}
              monthList={monthList}
              onChange={onSearch}
            />
            <div className='mb-2 flex items-center justify-center'>
              <div className='flex flex-wrap items-center gap-1 md:gap-4'>
                {categoryOptions?.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => onCategoryChange(opt)}
                    className={`rounded-md px-2 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm ${
                      category === opt.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
            <div className='md:hidden'>
              <RankTable
                key={`mobile-${category}`}
                columns={md_columns}
                list={list}
                i18n_lang={i18n.language}
              />
            </div>
            <div className='hidden md:block'>
              <RankTable
                key={`desktop-${category}`}
                columns={columns}
                list={list}
                i18n_lang={i18n.language}
              />
            </div>
            <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <div className='whitespace-pre-wrap leading-8'>
                <p>
                  <Trans ns='rank' i18nKey='lmrank.p_text' />
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
  const data = await getLMArenaRank(
    ip,
    query['month'] as unknown as number,
    query['category'] as string
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
        category: data.category,
        categoryList: data.category_list,
        ...(await serverSideTranslations(locale as string, ['common', 'rank'])),
      },
    };
  }
};

export default LMRankPage;
