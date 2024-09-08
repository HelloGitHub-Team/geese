import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { NoPrefetchLink } from '@/components/links/CustomLink';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { getOnefile } from '@/services/article';
import { getClientIP } from '@/utils/util';

import { OneItemsResp, TableOneItem } from '@/types/article';

type column = {
  key: string;
  title: string;
  title_en: string;
  width: number | string;
  render: (row: any, index: number) => any;
};

// 名称	语言	描述	查看
const columns: any[] = [
  {
    key: 'oid',
    title: '名称',
    title_en: 'Name',
    width: 130,
    render: (row: TableOneItem) => {
      return <span>{row.name}</span>;
    },
  },
  { key: 'language', title: '语言', title_en: 'Language', width: 100 },
  { key: 'suggestions', title: '描述', title_en: 'Description' },
];

const OneFilePage: NextPage<OneItemsResp> = ({ data }) => {
  const { t, i18n } = useTranslation('onefile');
  const router = useRouter();

  const handleCode = (oid: string) => {
    router.push(`/onefile/code/${oid}`);
  };

  return (
    <>
      <Seo title={t('title')} description={t('description')} />

      <div className='relative'>
        <Navbar middleText='OneFile' />
        <div className='my-2 bg-white px-2 pt-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='my-2'>
            <img
              className='w-max-full'
              src='https://img.hellogithub.com/article/tK30nYW8bMiPOdB_1647991896.png'
              alt='onefile'
            ></img>
            <p className='my-4 px-2'>
              <Trans ns='onefile' i18nKey='p_text' />
            </p>
          </div>

          <div className='overflow-hidden rounded-lg border shadow dark:border-gray-700 dark:shadow-none'>
            <table className='w-min	min-w-full table-fixed divide-y-2 divide-gray-200 text-sm dark:divide-gray-700'>
              <thead>
                <tr>
                  {columns?.map(
                    ({ key, title, title_en, width = 'auto' }: column) => (
                      <th
                        key={key}
                        scope='col'
                        style={{ width: width }}
                        className='px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300 md:px-6 md:py-3'
                      >
                        {i18n.language == 'en' ? title_en : title}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {data?.map((row: TableOneItem, index) => (
                  <tr
                    key={index}
                    className='cursor-pointer hover:bg-gray-100'
                    onClick={() => handleCode(row.oid)}
                  >
                    {columns.map(({ key, render }) => {
                      let content = row[key];
                      if (render) {
                        content = render(row, index);
                      }
                      return (
                        <td
                          key={key}
                          className='truncate whitespace-nowrap px-3 py-2 text-left text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300 md:px-6 md:py-4'
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-2 rounded-lg border bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
            <div className='whitespace-pre-wrap leading-8'>
              <p>
                <Trans ns='onefile' i18nKey='p_text2' />

                <NoPrefetchLink href='/onefile/join'>
                  <a>
                    <span className='cursor-pointer text-blue-400 underline hover:text-blue-500'>
                      {t('click')}
                    </span>
                  </a>
                </NoPrefetchLink>
                {t('p_text3')}
              </p>
            </div>
          </div>
          <div className='h-2' />
        </div>
      </div>
    </>
  );
};

export default OneFilePage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
}) => {
  const ip = getClientIP(req);
  const data = await getOnefile(ip);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        data: data.data,
        ...(await serverSideTranslations(locale as string, [
          'common',
          'onefile',
        ])),
      },
    };
  }
};
