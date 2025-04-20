import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai';
import { MdRefresh } from 'react-icons/md';

import { getRecommend } from '@/services/home';

import { RecommendSkeleton } from '../loading/skeleton';

import { RecommendItem, SideProps } from '@/types/home';

const RecommendList = ({ repositories }: { repositories: RecommendItem[] }) => (
  <div className='dark:text-gray-300'>
    {repositories.map((item) => (
      <Link
        prefetch={false}
        href={`/repository/${item.full_name}`}
        key={item.rid}
      >
        <div className='flex cursor-pointer flex-row rounded-md py-2 hover:bg-gray-50 hover:text-blue-400 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400'>
          <div className='flex w-full items-center px-1'>
            <img
              className='w-10 rounded-full border border-gray-100 dark:border-gray-900'
              src={item.author_avatar}
              width='40'
              height='40'
              alt='repo_avatar'
            />
            <div className='flex w-4/5 flex-col pl-2'>
              <div className='truncate text-ellipsis text-sm capitalize'>
                {item.full_name.length > 20 ? item.name : item.full_name}
              </div>
              <div className='flex flex-row pt-1 text-xs text-gray-400'>
                <div className='flex items-center pr-4'>
                  <AiOutlineStar size={14} />
                  <span className='pl-0.5'>{item.stars_str}</span>
                </div>
                <div className='truncate text-ellipsis'>
                  <span
                    style={{ backgroundColor: `${item.lang_color}` }}
                    className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1.5px] dark:border-gray-600'
                  />
                  <span className='whitespace-nowrap pl-0.5'>
                    {item.primary_lang}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

const isLicenseDetailPath = (pathname: string) => pathname === '/license/[lid]';

export default function Recommend({ t }: SideProps) {
  const router = useRouter();
  const { pathname, query } = router;

  const [repositories, setRepositories] = useState<RecommendItem[]>([]);

  const refreshRecommend = useCallback(async () => {
    setRepositories([]);
    const lid = query?.lid as string;
    const res = await getRecommend(lid);
    if (res?.success) {
      setRepositories(res.data);
    }
  }, [query?.lid]);

  useEffect(() => {
    refreshRecommend();
  }, [pathname, refreshRecommend]);

  const ShowIsLicenseDetail = isLicenseDetailPath(pathname);

  return (
    <>
      <div className='space-y-1.5 rounded-lg bg-white px-4 pt-3 pb-2 dark:bg-gray-800'>
        <div className='flex flex-row items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700'>
          <div className='text-sm font-medium text-gray-600 dark:text-gray-300'>
            {t('recommend.title')}
          </div>
          <div
            className='flex cursor-pointer flex-row items-center text-xs text-gray-400 hover:text-blue-500'
            onClick={refreshRecommend}
          >
            <MdRefresh />
            <span className='pl-0.5'>{t('recommend.change')}</span>
          </div>
        </div>
        {repositories.length === 0 ? (
          <RecommendSkeleton loop={5} />
        ) : (
          <RecommendList repositories={repositories} />
        )}
      </div>
      {ShowIsLicenseDetail && (
        <div className='space-y-1.5 rounded-lg bg-white px-4 pt-3 pb-2 text-sm dark:bg-gray-800'>
          {t('recommend.desc')}
          <a
            target='_blank'
            className='cursor-pointer px-1 hover:text-blue-500'
            href='https://creativecommons.org/licenses/by/3.0/deed.zh'
            rel='noreferrer'
          >
            CC-BY-3.0
          </a>
          {t('recommend.desc2')}
        </div>
      )}
    </>
  );
}
