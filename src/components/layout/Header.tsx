import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineBell, AiOutlineGithub } from 'react-icons/ai';

import { useLoginContext } from '@/hooks/useLoginContext';

import HeaderBtn from '@/components/buttons/HeaderBtn';
import RankButton from '@/components/buttons/RankButton';
import { RepoModal } from '@/components/dialog/RepoModal';
import AvatarWithDropdown from '@/components/dropdown/AvatarWithDropdown';

import { LoginButton } from '../buttons/LoginButton';
import SearchInput from '../search/SearchInput';

const Header = () => {
  const router = useRouter();
  const { isLogin, userInfo } = useLoginContext();
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
    <div className='hg-header fixed z-10 h-14 w-full bg-white shadow-sm backdrop-blur dark:border dark:border-gray-50/[0.06] dark:bg-transparent'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between px-2 py-2 md:py-0 lg:px-0 xl:max-w-5xl 2xl:max-w-7xl'>
        {/* pc 端显示的 logo */}
        <span className='hidden py-2 md:block'>
          <img
            className='cursor-pointer hover:animate-spin dark:invert'
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
        <ul className='text-md ml-5 flex items-center space-x-2 font-medium text-gray-500 dark:text-gray-400 md:pt-2'>
          {/* pc 端显示的顶部按钮 */}
          <li className={liClassName('/')}>
            <HeaderBtn pathname='/'>首页</HeaderBtn>
          </li>
          <li className={liClassName('/periodical')}>
            <HeaderBtn pathname='/periodical'>月刊</HeaderBtn>
          </li>
          <li className={liClassName('/report/tiobe')}>
            <RankButton />
          </li>
          <li className={liClassName('/article')}>
            <HeaderBtn pathname='/article'>文章</HeaderBtn>
          </li>
          <li className={liClassName('/onefile')}>
            <HeaderBtn pathname='/onefile'>OneFile</HeaderBtn>
          </li>
          {/* 移动端显示的登录按钮和头像 */}
          <li className='block md:hidden'>
            {!isLogin ? <LoginButton /> : <AvatarWithDropdown />}
          </li>
        </ul>
        <div className='shrink grow'></div>
        <div className='hidden cursor-pointer space-x-2 md:flex'>
          <RepoModal>
            <button className='flex h-8 cursor-pointer items-center rounded-lg border border-blue-500 bg-blue-500 px-2 text-sm text-white hover:border-blue-600 hover:bg-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-gray-800 dark:active:bg-gray-900 lg:mr-2'>
              <AiOutlineGithub size={16} className='mr-0.5' />
              提交项目
            </button>
          </RepoModal>
          {isLogin && userInfo?.success ? (
            <div
              className='flex flex-row items-center'
              onClick={() => {
                router.push('/notification');
              }}
            >
              <span className='relative inline-flex'>
                <AiOutlineBell
                  size={22}
                  className='text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500'
                />
                {userInfo?.unread.total > 0 ? (
                  <span className='relative right-1 inline-flex h-2 w-2 rounded-full bg-red-500' />
                ) : (
                  <span className='w-2' />
                )}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
