import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import { useMemo } from 'react';

import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import {
  getMonthName,
  RankSearchBar,
  RankTable,
} from '@/components/rankTable/RankTable';
import {
  ArenaModel,
  ArenaPrice,
  ArenaPriceHeader,
  ArenaProviderLink,
} from '@/components/report/ArenaModel';
import { RatingWithTrendRender } from '@/components/report/Report';
import Seo from '@/components/Seo';

import { getLMArenaRank } from '@/services/rank';
import { getArenaPriceTiers } from '@/utils/arenaPrice';
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
  providers,
  list,
}) => {
  const { t, i18n } = useTranslation('rank');
  const router = useRouter();

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

  const showArenaPrice = providers.length === 0;
  const priceColumnWidth = i18n.language.startsWith('zh') ? 168 : 192;
  const priceTiers = useMemo(() => {
    if (showArenaPrice) return getArenaPriceTiers(list || []);
    const pricedProviders = new Set(
      providers.filter((provider) => provider.is_show_price).map(({ id }) => id)
    );
    return getArenaPriceTiers(
      (list || []).flatMap((row) =>
        (row.providers || []).filter((offer) =>
          pricedProviders.has(offer.provider_id)
        )
      )
    );
  }, [list, providers, showArenaPrice]);

  const tableMinWidth =
    48 +
    240 +
    72 +
    72 +
    (showArenaPrice ? priceColumnWidth : 0) +
    providers.reduce(
      (width, provider) =>
        width + 104 + (provider.is_show_price ? priceColumnWidth : 0),
      0
    );

  // 表格列配置
  const columns: any[] = useMemo(
    () => [
      {
        key: 'position',
        title: (
          <span className='block text-center'>
            {t('lmrank.thead.position')}
          </span>
        ),
        width: 48,
        render: (row: LMArenaRankDataItem) => (
          <span className='block text-center tabular-nums'>{row.position}</span>
        ),
      },
      {
        key: 'name',
        title: <span className='pl-10'>{t('lmrank.thead.name')}</span>,
        width: 240,
        render: (row: LMArenaRankDataItem) => {
          const provider = providers.find(({ id }) =>
            row.providers?.some(
              (offer) =>
                offer.provider_id === id &&
                offer.model_id &&
                (i18n.language.startsWith('zh')
                  ? offer.model_url_zh
                  : offer.model_url_en)
            )
          );
          return (
            <ArenaModel
              model={row}
              provider={provider}
              offer={row.providers?.find(
                (offer) => offer.provider_id === provider?.id
              )}
            />
          );
        },
      },
      {
        key: 'rating',
        title: t('lmrank.thead.rating'),
        render: (row: LMArenaRankDataItem) =>
          RatingWithTrendRender(
            {
              ...row,
              rating: Number(row.rating).toLocaleString(i18n.language, {
                maximumFractionDigits: 0,
                useGrouping: false,
              }),
            },
            false,
            i18n.language
          ),
        width: 72,
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
          );
        },
        width: 72,
      },
      ...(showArenaPrice
        ? [
            {
              key: 'price-arena',
              title: <ArenaPriceHeader />,
              render: (row: LMArenaRankDataItem) => (
                <ArenaPrice
                  offer={row}
                  providerName='Arena'
                  tier={priceTiers.get(row)}
                />
              ),
              width: priceColumnWidth,
            },
          ]
        : []),
      ...providers.flatMap((provider) => [
        ...(provider.is_show_price
          ? [
              {
                key: `price-${provider.id}`,
                title: (
                  <ArenaPriceHeader
                    providerName={
                      providers.length > 1 ? provider.name : undefined
                    }
                  />
                ),
                render: (row: LMArenaRankDataItem) => {
                  const offer = row.providers?.find(
                    (item) => item.provider_id === provider.id
                  );
                  return (
                    <ArenaPrice
                      offer={offer}
                      providerName={provider.name}
                      tier={offer ? priceTiers.get(offer) : undefined}
                    />
                  );
                },
                width: priceColumnWidth,
              },
            ]
          : []),
        {
          key: `provider-${provider.id}`,
          title: (
            <span className='inline-flex items-center gap-0.5'>
              {provider.code === 'ofox' && (
                <img
                  src='/images/arena/ofox.svg'
                  alt=''
                  aria-hidden='true'
                  width={16}
                  height={16}
                  className='h-4 w-4 shrink-0 dark:invert'
                />
              )}
              {provider.name}
            </span>
          ),
          render: (row: LMArenaRankDataItem) => (
            <ArenaProviderLink
              name={row.name}
              provider={provider}
              offer={row.providers?.find(
                (offer) => offer.provider_id === provider.id
              )}
            />
          ),
          width: 104,
        },
      ]),
    ],
    [i18n.language, t, priceTiers, providers, showArenaPrice, priceColumnWidth]
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
            <div className='mb-4 mt-3 flex items-center justify-center'>
              <div className='flex flex-wrap items-center justify-center gap-1 rounded-lg bg-gray-100/80 p-1 dark:bg-gray-900/40'>
                {categoryOptions?.map((opt) => (
                  <button
                    key={opt.key}
                    type='button'
                    aria-pressed={category === opt.key}
                    onClick={() => onSearch('category', opt.key)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 md:px-3 md:text-sm ${
                      category === opt.key
                        ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 hover:bg-white/60 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
                    }`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
            {list.length ? (
              <RankTable
                key={`${year}-${month}-${category}`}
                columns={columns}
                minWidth={tableMinWidth}
                stretchLastColumn
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
                  {providers.length > 0 && ` ${t('lmrank.provider_note')}`}
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
        providers: data.providers ?? [],
        ...(await serverSideTranslations(locale as string, ['common', 'rank'])),
      },
    };
  }
};

export default LMRankPage;
