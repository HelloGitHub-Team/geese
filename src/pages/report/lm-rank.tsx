import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useId, useMemo, useState } from 'react';

import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import {
  getMonthName,
  RankSearchBar,
  RankTable,
} from '@/components/rankTable/RankTable';
import {
  ArenaModel,
  ArenaModelID,
  ArenaPrice,
} from '@/components/report/ArenaModel';
import { RatingWithTrendRender } from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getLMArenaRank } from '@/services/rank';
import { getClientIP } from '@/utils/util';

import { LMArenaRankDataItem, LMArenaRankPageProps } from '@/types/rank';

// 类别名称映射
const categoryMap: Record<string, { en: string; zh: string }> = {
  text: { en: 'Text', zh: '文本' },
  webdev: { en: 'Coding', zh: '编码' },
  vision: { en: 'Vision', zh: '视觉' },
  'text-to-image': { en: 'Text to Image', zh: '文生图' },
  'text-to-video': { en: 'Text to Video', zh: '文生视频' },
};

const getCategoryName = (category: string, lang: string) => {
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
  const [expandedModel, setExpandedModel] = useState<LMArenaRankDataItem>();
  const modelDetailsId = useId();

  useEffect(() => {
    setExpandedModel(undefined);
  }, [year, month, category]);

  const onSearch = (key: string, value: string) => {
    const currentQuery = { ...router.query };
    if (key === 'target') {
      router.push(`${value}`);
      return;
    }
    currentQuery[key] = value;
    router.push({
      pathname: '/report/lm-rank',
      query: currentQuery,
    });
  };

  // 类别选项
  const categoryOptions = useMemo(() => {
    return (categoryList || [])
      .filter((cat) => Object.keys(categoryMap).includes(cat))
      .map((cat) => ({
        key: cat,
        value: getCategoryName(cat, i18n.language),
      }));
  }, [categoryList, i18n.language]);

  // 表格列配置
  const columns: any[] = useMemo(
    () => [
      { key: 'position', title: t('lmrank.thead.position'), width: 60 },
      {
        key: 'name',
        title: t('lmrank.thead.name'),
        width: 248,
        render: (row: LMArenaRankDataItem) => (
          <ArenaModel
            model={row}
            expanded={expandedModel === row}
            controlsId={`${modelDetailsId}-${list.indexOf(row)}`}
            onToggle={() =>
              setExpandedModel((current) => (current === row ? undefined : row))
            }
          />
        ),
      },
      {
        key: 'rating',
        title: t('lmrank.thead.rating'),
        render: (row: LMArenaRankDataItem) => (
          <div
            className={`relative flex h-10 ${
              expandedModel === row ? 'items-start' : 'items-center'
            }`}
          >
            <div className='flex h-5 items-center'>
              {RatingWithTrendRender(
                {
                  ...row,
                  rating: Number(row.rating).toLocaleString(i18n.language, {
                    maximumFractionDigits: 0,
                    useGrouping: false,
                  }),
                },
                false,
                i18n.language
              )}
            </div>
            <div className='absolute left-0 top-6 w-max'>
              <ArenaModelID
                model={row}
                id={`${modelDetailsId}-${list.indexOf(row)}`}
                hidden={expandedModel !== row}
              />
            </div>
          </div>
        ),
        width: 100,
      },
      {
        key: 'votes',
        title: t('lmrank.thead.votes'),
        render: (row: LMArenaRankDataItem) => {
          const count = row.votes;
          const validCount = !(
            typeof count !== 'number' ||
            !Number.isInteger(count) ||
            count < 0
          );
          return (
            <div
              className={`flex h-10 ${
                expandedModel === row ? 'items-start' : 'items-center'
              }`}
            >
              <span
                className='leading-5'
                title={
                  validCount ? count.toLocaleString(i18n.language) : undefined
                }
              >
                {!validCount
                  ? '—'
                  : count < 1000
                  ? count
                  : `${(count / 1000).toLocaleString(i18n.language, {
                      maximumFractionDigits: 1,
                      useGrouping: false,
                    })}k`}
              </span>
            </div>
          );
        },
        width: 100,
      },
      {
        key: 'price',
        title: t('lmrank.thead.price'),
        render: (row: LMArenaRankDataItem) => (
          <div
            className={`flex h-10 ${
              expandedModel === row ? 'items-start' : 'items-center'
            }`}
          >
            <div className='flex h-5 items-center'>
              <ArenaPrice model={row} />
            </div>
          </div>
        ),
        width: 180,
      },
    ],
    [i18n.language, t, expandedModel, modelDetailsId, list]
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
              title='Arena'
              logo='/images/arena/arena.svg'
              i18n_lang={i18n.language}
              monthList={Array.from(new Set([month, ...monthList])).sort(
                (a, b) => b - a
              )}
              onChange={onSearch}
            />
            <div className='mb-2 flex items-center justify-center'>
              <div className='flex flex-wrap items-center gap-1 md:gap-4'>
                {categoryOptions?.map((opt) => (
                  <button
                    key={opt.key}
                    type='button'
                    aria-pressed={category === opt.key}
                    onClick={() => onSearch('category', opt.key)}
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
            {!!list.length && (
              <p className='mb-2 px-1 text-xs text-gray-500 dark:text-gray-400 md:hidden'>
                {t('lmrank.scroll_hint')}
              </p>
            )}
            {list.length ? (
              <RankTable
                key={`${year}-${month}-${category}`}
                columns={columns}
                minWidth={700}
                compact
                list={list}
                i18n_lang={i18n.language}
              />
            ) : (
              <p className='rounded-lg border py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400'>
                {t('lmrank.empty')}
              </p>
            )}
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
  const requestedCategory = query['category'];
  const category =
    typeof requestedCategory === 'string' &&
    Object.keys(categoryMap).includes(requestedCategory)
      ? requestedCategory
      : 'text';
  const data = await getLMArenaRank(
    ip,
    query['month'] as unknown as number,
    category
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
