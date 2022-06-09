import Link from 'next/link';
import * as React from 'react';

const Sort = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <div className='relative bg-white'>
      <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
        <div className='flex py-2.5 pl-4 pr-3'>
          <div className='flex items-center justify-start space-x-2'>
            <Link href='/'>
              <a className='flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-blue-500 dark:bg-slate-700'>
                热门
              </a>
            </Link>
            <Link href='/2'>
              <a className='flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-blue-500 dark:bg-slate-700'>
                最新
              </a>
            </Link>

            <Link href='/3'>
              <div className='absolute top-0 right-0 p-2.5'>
                <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white focus:outline-none active:bg-blue-600 disabled:opacity-50'>
                  提交
                </a>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sort;
