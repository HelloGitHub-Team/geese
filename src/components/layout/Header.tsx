import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';



const Header = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <header className='shadow-md bg-white'>
      <nav className="flex items-center justify-between max-w-5xl p-4 mx-auto">
        <Link
          className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 rounded-lg"
          href="/"
        >
          <img
            className="h-8"
            src='https://raw.githubusercontent.com/521xueweihan/img_logo/main/logo/logo.png'
          ></img>
        </Link>

        <ul className="flex items-center space-x-2 text-md font-medium text-gray-500">
          <li><a className="px-3 py-2 rounded-lg" href=""> 提交项目 </a></li>
          {!isLogin ? <li>
            <a
              className="inline-flex items-center px-3 py-2 rounded-lg"
              href=""
              target="_blank"
            >
              登录
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="ml-1.5 w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </a>
          </li> : <></>}

        </ul>
      </nav>
    </header>
  );
}


export default Header;
