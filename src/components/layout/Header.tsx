import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineBook, AiOutlineHome } from 'react-icons/ai';
import { BsFileEarmarkCode, BsVectorPen } from 'react-icons/bs';
import { MdOutlineArticle } from 'react-icons/md';

import { useLoginContext } from '@/hooks/useLoginContext';

import HeaderBtn from '@/components/buttons/HeaderBtn';
import RankButton from '@/components/buttons/RankButton';
import AvatarWithDropdown from '@/components/dropdown/AvatarWithDropdown';

import LoginButton from '../buttons/LoginButton';
import SearchInput from '../search/SearchInput';

const Header = () => {
  const router = useRouter();
  const { isLogin } = useLoginContext();
  const [curPath, setCurPath] = useState('');

  useEffect(() => {
    setCurPath(router.pathname);
  }, [router.pathname]);

  const liClassName = (path: string) =>
    classNames(
      'hidden md:block hover:font-bold hover:text-gray-800 hover:border-blue-500 hover:border-b-2 h-12',
      {
        'text-blue-500': curPath === path,
        'text-gray-500': curPath !== path,
      }
    );

  return (
    <div className='fixed z-10 h-14 w-full bg-white shadow-sm backdrop-blur dark:border dark:border-gray-50/[0.06] dark:bg-transparent'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between px-2 py-2 md:py-0 xl:max-w-5xl 2xl:max-w-7xl'>
        {/* pc 端显示的 logo */}
        <span className='hidden py-2 md:block'>
          <img
            className='cursor-pointer dark:invert'
            src='https://img.hellogithub.com/logo/logo.png'
            width='28'
            height='28'
            alt='header_logo'
            onClick={() => {
              router.push('/');
            }}
          />
        </span>
        {/* 移动端显示的[排行榜]等按钮的下拉列表 */}
        <div className='md:hidden'>
          <RankButton type='dropdown' />
        </div>
        <SearchInput />
        <ul className='text-md flex items-center space-x-2 font-medium text-gray-500 dark:text-gray-400 md:pt-2'>
          {/* pc 端显示的顶部按钮 */}
          <li className={liClassName('/')}>
            <HeaderBtn pathname='/'>
              <AiOutlineHome className='mr-0.5' />
              <span>首页</span>
            </HeaderBtn>
          </li>
          <li className={liClassName('/periodical')}>
            <HeaderBtn pathname='/periodical'>
              <AiOutlineBook className='mr-0.5' />
              <span>月刊</span>
            </HeaderBtn>
          </li>
          <li className={liClassName('/report/tiobe')}>
            <RankButton />
          </li>
          <li className={liClassName('/article')}>
            <HeaderBtn pathname='/article'>
              <MdOutlineArticle className='mr-0.5' />
              <span>文章</span>
            </HeaderBtn>
          </li>
          <li className={liClassName('/onefile')}>
            <HeaderBtn pathname='/onefile'>
              <BsFileEarmarkCode className='mr-0.5' />
              <span>OneFile</span>
            </HeaderBtn>
          </li>
          <li className={liClassName('/license')}>
            <HeaderBtn pathname='/license'>
              <BsVectorPen className='mr-0.5' />
              <span>开源协议</span>
            </HeaderBtn>
          </li>
          {/* 移动端显示的登录按钮和头像 */}
          <li className='block md:hidden'>
            {!isLogin ? <LoginButton /> : <AvatarWithDropdown />}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
