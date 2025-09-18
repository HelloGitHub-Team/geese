import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GoLinkExternal } from 'react-icons/go';

import { CustomLink } from '@/components/links/CustomLink';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

interface LinkItem {
  name: string;
  url: string;
  logo: string;
}

const linksData: LinkItem[] = [
  {
    name: '优云智算',
    url: 'https://www.compshare.cn/?ytag=logo_hellogithub_otherdsp_display',
    logo: 'https://img.hellogithub.com/links/compshare.png',
  },
  {
    name: '林枫云',
    url: 'https://www.dkdun.cn/',
    logo: 'https://img.hellogithub.com/links/dkdun.png',
  },
  {
    name: 'OceanBase 社区',
    url: 'https://open.oceanbase.com/',
    logo: 'https://img.hellogithub.com/links/oceanbase.png',
  },
  {
    name: 'Monibuca',
    url: 'https://monibuca.com/',
    logo: 'https://img.hellogithub.com/links/monibuca.jpeg',
  },
  {
    name: 'SwanLab',
    url: 'https://swanlab.cn/',
    logo: 'https://img.hellogithub.com/links/swanlab.png',
  },
];

const LinksPage: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Seo title={t('links.title')} description={t('links.description')} />

      <Navbar middleText={t('links.title')} />

      <div className='mt-2 bg-white p-6 dark:bg-gray-800 md:rounded-lg'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {linksData.map((link, index) => (
            <CustomLink
              key={index}
              href={link.url}
              className='group relative h-16 overflow-hidden rounded-sm border border-gray-200 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-300 dark:hover:border-gray-600'
            >
              <div className='flex h-full w-full items-center justify-center'>
                <div
                  className='h-3/5 w-3/5 bg-contain bg-center bg-no-repeat'
                  style={{ backgroundImage: `url(${link.logo})` }}
                />
              </div>

              <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-900/60'>
                <div className='flex items-center gap-1'>
                  <GoLinkExternal className='h-4 w-4 text-white dark:text-gray-100' />
                  <h3 className='text-center text-sm font-medium leading-tight text-white dark:text-gray-100'>
                    {link.name}
                  </h3>
                </div>
              </div>
            </CustomLink>
          ))}

          <CustomLink
            href='https://z797q1qcv8.feishu.cn/share/base/form/shrcnFGDsq9wMH1JjxHyV6FYqMf'
            className='rounded-xs group relative h-16 overflow-hidden border-2 border-dashed border-gray-300 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md dark:border-gray-600 dark:hover:border-blue-500'
          >
            <div className='flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500'>
              <div className='flex items-center gap-1 transition-colors duration-200 group-hover:text-blue-500 dark:group-hover:text-blue-400'>
                <div className='text-sm font-medium leading-none'>+</div>
                <div className='text-sm font-medium'>{t('links.vacancy')}</div>
              </div>
            </div>
          </CustomLink>
        </div>
      </div>
      <ToTop />
      <div className='h-4' />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};

export default LinksPage;
