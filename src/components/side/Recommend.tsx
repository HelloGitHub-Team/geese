import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai';
import { MdRefresh } from 'react-icons/md';

import { getRecommend } from '@/services/home';

import Loading from '../loading/Loading';

import { RecomemndItem } from '@/types/home';

export default function Recommend() {
  const [repositories, setRepositories] = useState<RecomemndItem[]>([]);
  const router = useRouter();
  const { pathname, query } = router;

  const isLicenseDetail = useMemo(() => {
    return pathname === '/license/[lid]';
  }, [pathname]);
  // 协议spdxId,即协议名称
  const spdxId = useMemo(() => {
    return query.spdx as string;
  }, [query]);

  const refreshRecommend = useCallback(async () => {
    const res = await getRecommend(spdxId);
    if (res?.success) {
      setRepositories(res.data);
    }
  }, [spdxId]);

  useEffect(() => {
    refreshRecommend();
  }, [refreshRecommend]);

  return (
    <>
      <div className='space-y-1.5 rounded-lg bg-white px-4 pt-3 pb-2 dark:bg-gray-800'>
        <div className='flex flex-row items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700'>
          <div className='text-sm font-medium text-gray-600 dark:text-gray-300'>
            {isLicenseDetail ? `${spdxId}协议的开源项目` : '推荐项目'}
          </div>
          {!isLicenseDetail && (
            <div
              className='flex cursor-pointer flex-row items-center text-xs text-gray-400 hover:text-blue-500'
              onClick={refreshRecommend}
            >
              <MdRefresh />
              <span className='pl-0.5'>换一换</span>
            </div>
          )}
        </div>
        {repositories.length == 0 ? (
          <Loading />
        ) : (
          <div className='dark:text-gray-300'>
            {repositories.map((item) => (
              <Link href={`/repository/${item.rid}/`} key={item.rid}>
                <div className='flex cursor-pointer flex-row rounded-md py-2 hover:bg-gray-50 hover:text-blue-400  dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400'>
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
                        {item.full_name}
                      </div>
                      <div className='flex flex-row pt-1 text-xs text-gray-400 '>
                        <div className='flex items-center pr-4'>
                          <AiOutlineStar size={14} />
                          <span className='pl-0.5'>{item.stars_str}</span>
                        </div>
                        <div className='truncate text-ellipsis'>
                          <span
                            style={{ backgroundColor: `${item.lang_color}` }}
                            className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1.5px] dark:border-gray-600'
                          ></span>
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
        )}
      </div>
      {isLicenseDetail && (
        <div className='space-y-1.5 rounded-lg bg-white px-4 pt-3 pb-2 text-xs dark:bg-gray-800'>
          协议的原始数据来自 spdx，并参考了 Github 的 chooselicense 内容。
        </div>
      )}
    </>
  );
}
