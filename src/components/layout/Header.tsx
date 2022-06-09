import Link from 'next/link';
import * as React from 'react';

const Header = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <header className='bg-white shadow-md'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between p-4'>
        <Link
          className='inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50'
          href='/'
        >
          <img
            className='h-8'
            src='https://raw.githubusercontent.com/521xueweihan/img_logo/main/logo/logo.png'
          ></img>
        </Link>

        <ul className='text-md flex items-center space-x-2 font-medium text-gray-500'>
          <li>
            <a className='rounded-lg px-3 py-2' href=''>
              月刊
            </a>
          </li>
          {!isLogin ? (
            <li>
              <a
                className='inline-flex items-center rounded-lg px-3 py-2'
                href=''
                target='_blank'
              >
                登录
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='ml-1.5 h-4 w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  ></path>
                </svg>
              </a>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
