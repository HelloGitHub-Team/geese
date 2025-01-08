import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo } from 'react';

import CategoryNavbar from '@/components/navbar/CategoryBar';
import Pagination from '@/components/pagination/Pagination';
import PeriodItem from '@/components/periodical/item';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getCategory } from '@/services/category';
import { nameMap } from '@/utils/constants';
import stringify from '@/utils/qs-stringify';
import { getClientIP } from '@/utils/util';

import {
  CategoryPageProps,
  CategroyName,
  PeriodicalItem,
} from '@/types/periodical';

const PeriodicalCategoryPage: NextPage<CategoryPageProps> = ({
  category,
  sortBy,
}) => {
  const { t, i18n } = useTranslation('periodical');

  const router = useRouter();

  // 项目列表
  const allItems: PeriodicalItem[] = useMemo(() => {
    return category?.data || [];
  }, [category]);

  // 分类列表
  const categoryItem: CategroyName = useMemo(() => {
    const newItem = {
      name: category.category_name,
      value: category.category_name,
    }; // 创建一个新对象，避免直接修改原对象
    if (i18n.language === 'en') {
      const mappedName = nameMap[category.category_name];
      newItem.name = mappedName || category.category_name.split(' ')[0];
    }
    return newItem;
  }, [category, i18n.language]); // 确保 i18n.language 被作为依赖项

  const onPageChange = (page: number) => {
    const name = category?.category_name;
    const nextURL = `/periodical/category/${encodeURIComponent(
      name
    )}?${stringify({
      page: page,
      sort_by: sortBy ? sortBy : null,
    })}`;
    router.push(nextURL);
  };

  if (router.isFallback) {
    return (
      <div className='mt-20 flex animate-pulse'>
        <Seo title='HelloGitHub 月刊' />
        <div className='ml-4 mt-2 w-full'>
          <h3 className='h-4 rounded-md bg-gray-200' />
          <ul className='mt-5 space-y-3'>
            <li className='h-4 w-full rounded-md bg-gray-200' />
            <li className='h-4 w-full rounded-md bg-gray-200' />
            <li className='h-4 w-full rounded-md bg-gray-200' />
            <li className='h-4 w-full rounded-md bg-gray-200' />
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={t('category.title', { name: categoryItem.name })} />
      <div className='relative pb-6'>
        <CategoryNavbar
          category={category.category_name}
          middleText={categoryItem.name}
          t={t}
        />
        <div className='my-2 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='text-normal mb-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
            <div className='whitespace-pre-wrap rounded-lg border bg-white p-2 font-normal leading-8 text-gray-500 dark:bg-gray-800 dark:text-gray-300'>
              <p>
                <Trans ns='periodical' i18nKey='category.p_text' />
                <span className='font-bold'>
                  {` HelloGitHub ${categoryItem.name} `}
                </span>
                {t('category.p_text2')}
              </p>
            </div>
          </div>

          {allItems?.map((item: PeriodicalItem, index: number) => {
            return (
              <PeriodItem
                key={index}
                item={item}
                index={(category?.current_page - 1) * 10 + index}
              />
            );
          })}
        </div>

        <Pagination
          total={category?.page_total}
          current={category?.current_page}
          onPageChange={onPageChange}
          PreviousText={t('page_prev')}
          NextText={t('page_next')}
        />
      </div>
      <div className='hidden md:block'>
        <ToTop />
      </div>
    </>
  );
};

export default PeriodicalCategoryPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  locale,
}) => {
  const ip = getClientIP(req);
  const name = query['name'] as string;
  const sortBy = query['sort_by']?.toString() ?? null;
  const data = await getCategory(
    ip,
    name,
    query['page'] as unknown as number,
    sortBy
  );
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        category: data,
        sortBy: sortBy,
        ...(await serverSideTranslations(locale as string, [
          'common',
          'periodical',
        ])),
      },
    };
  }
};
