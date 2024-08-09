import { NextPage } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import Button from '@/components/buttons/Button';
import { RepoModal } from '@/components/dialog/RepoModal';
import { CustomLink } from '@/components/links/CustomLink';
import { PeriodicalSkeleton } from '@/components/loading/skeleton';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { nameMap } from '@/utils/constants';
import { numFormat } from '@/utils/util';

import { AllItems, CategroyName, VolumeNum } from '@/types/periodical';

const PeriodicalIndexPage: NextPage = () => {
  const { t, i18n } = useTranslation('periodical');

  const [category, setCategory] = useState(
    i18n.language == 'en' ? 'C' : 'C 项目'
  );
  const [volume, setVolume] = useState('');

  const { data, isValidating } = useSWRImmutable<AllItems>(
    makeUrl('/periodical/'),
    fetcher
  );
  const categories = data?.success ? data.categories : [];
  const volumes = data?.success ? data.volumes : [];
  const repo_total = data?.success ? data.repo_total : 0;

  // 分类列表
  const categoryItems: CategroyName[] = useMemo(() => {
    return categories.map((item: CategroyName) => {
      const newItem = { ...item }; // 创建一个新对象，避免直接修改原对象
      newItem.value = newItem.name;
      if (i18n.language === 'en') {
        const mappedName = nameMap[newItem.name];
        newItem.name = mappedName || newItem.name.split(' ')[0];
      }
      return newItem;
    });
  }, [categories, i18n.language]); // 确保 i18n.language 被作为依赖项

  const selectVolume = (e: any) => {
    setVolume(e.target.value);
  };

  const selectCategory = (e: any) => {
    setCategory(e.target.value);
  };

  return (
    <>
      <Seo title={t('title')} description={t('description')} />
      <div className='relative'>
        <Navbar middleText={t('nav')} />
        <div className='my-2 bg-white px-4 pt-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='flex flex-col items-center'>
            <img src='https://img.hellogithub.com/logo/readme.gif'></img>
            <p className='px-1 py-3 leading-7'>
              <Trans ns='periodical' i18nKey='p_text' />
            </p>
          </div>
          {isValidating ? (
            <PeriodicalSkeleton />
          ) : (
            <dl className='grid grid-cols-3 gap-2'>
              <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  {t('order_t1')}
                </dt>
                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {volumes.length}
                </dd>
                <span className='pt-3 text-base font-medium text-gray-500'>
                  {t('order_t2')}
                </span>
                <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
                  <div className='py-3'>
                    <span className='hidden text-sm md:inline-block'>
                      {t('order_t3')}
                    </span>
                    <select
                      onChange={selectVolume}
                      className='w-fit truncate text-ellipsis rounded-md border border-opacity-0 py-1 pr-7 text-sm dark:bg-gray-700'
                    >
                      {volumes.map((item: VolumeNum) => (
                        <option key={item.num} value={item.num}>
                          {item.num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='order-last mt-4'>
                  <CustomLink
                    href={
                      volume == ''
                        ? `/periodical/volume/${volumes.length}`
                        : `periodical/volume/${volume}`
                    }
                  >
                    <Button
                      variant='white-outline'
                      className='px-4 py-1 font-medium'
                    >
                      {t('read_button')}
                    </Button>
                  </CustomLink>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  {t('order_t4')}
                </dt>

                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {categories.length}
                </dd>

                <span className='pt-3 text-base font-medium text-gray-500'>
                  {t('order_t5')}
                </span>

                <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
                  <div className='py-3'>
                    <span className='hidden text-sm md:inline-block'>
                      {t('order_t6')}
                    </span>

                    <select
                      onChange={selectCategory}
                      className='w-full truncate text-ellipsis rounded-md border border-opacity-0 py-1 pr-7 text-sm dark:bg-gray-700 md:w-28'
                    >
                      {categoryItems.map((item: CategroyName) => (
                        <option key={item.name} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='order-last mt-4'>
                  <CustomLink
                    href={`/periodical/category/${encodeURIComponent(
                      category === 'C' ? 'C 项目' : category
                    )}`}
                  >
                    <Button
                      variant='white-outline'
                      className='px-4 py-1 font-medium'
                    >
                      {t('read_button')}
                    </Button>
                  </CustomLink>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  {t('order_t7')}
                </dt>

                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {numFormat(repo_total, 1)}
                </dd>

                <span className='pt-3 text-base font-medium text-gray-500'>
                  {t('order_t8')}
                </span>

                <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
                  <div className='h-[54px] py-3'>
                    <span className='text-xs md:text-base'>
                      {t('order_t9')}
                    </span>
                  </div>
                </div>

                <div className='order-last mt-4'>
                  <RepoModal>
                    <Button
                      variant='white-outline'
                      className='px-4 py-1 font-medium'
                    >
                      {t('submit_button')}
                    </Button>
                  </RepoModal>
                </div>
              </div>
            </dl>
          )}
          <div className='h-4 lg:h-2'></div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'periodical'])),
    },
  };
}

export default PeriodicalIndexPage;
