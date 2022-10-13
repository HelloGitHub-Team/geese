import Link from 'next/link';
import * as React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

import Seo from '@/components/Seo';
import ThemeSwitch from '@/components/ThemeSwitch';

import SVG500 from '~/images/500.svg';

export default function ServerErrorPage() {
  return (
    <>
      <Seo templateTitle='Internal Server Error' />

      <main>
        <div className='hidden'>
          <ThemeSwitch />
        </div>
        <section className='min-h-screen bg-white dark:bg-gray-800'>
          <div className='flex flex-col items-center justify-center'>
            <div className='mx-4 mt-14 mb-2'>
              <SVG500 className='hidden md:block' width={500} height={500} />
              <SVG500 className='md:hidden' width={300} height={300} />
            </div>
            <Link href='/'>
              <div className='group relative inline-flex cursor-pointer items-center overflow-hidden rounded border border-current px-7 py-2 text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:text-gray-500 dark:active:text-gray-500'>
                <span className='absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4'>
                  <IoIosArrowForward size={16} />
                </span>

                <span className='text-sm font-medium transition-all group-hover:mr-4'>
                  <span>返回首页</span>
                </span>
              </div>
            </Link>
            <div className='mt-4 block text-xs text-gray-400'>
              <a
                target='_blank'
                className='cursor-pointer hover:underline'
                href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
                rel='noreferrer'
              >
                <span>反馈问题</span>
              </a>
              <span className='px-1'>·</span>
              <a
                target='_blank'
                className='cursor-pointer hover:underline'
                href='https://github.com/HelloGitHub-Team/geese'
                rel='noreferrer'
              >
                <span>贡献代码</span>
              </a>
              <p className='mt-2'>
                <span className='cursor-default'>©2022 HelloGitHub</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
