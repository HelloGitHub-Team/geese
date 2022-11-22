import classNames from 'classnames';
import introJs from 'intro.js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineBook, AiOutlineHome } from 'react-icons/ai';
import { MdOutlineArticle } from 'react-icons/md';

import 'intro.js/introjs.css';

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

  useEffect(() => {
    console.log({ isLogin });

    const hasGuided = localStorage.getItem('hasGuided');
    if (!hasGuided && !isLogin) {
      // 定义引导步骤
      const steps = [
        {
          element: '#searchInput',
          description: '在这里搜索开源项目',
        },
        {
          element: '#headMenu',
          description: '在这里访问月刊、排行榜、文章',
        },
        {
          element: '#PCLoginBtn',
          description: '立即登录解锁更多内容，我的主页可以管理收藏项目和评论',
        },
        {
          element: '#labelBar',
          description: '可按照最新、热门、标签查看项目',
        },
        {
          element: '#repositoryItems',
          description: '项目简介，点击可查看项目详情',
        },
      ];

      const intro = introJs();

      setTimeout(() => {
        intro
          .setOptions({
            nextLabel: '下一步',
            prevLabel: '上一步',
            doneLabel: '立即体验',
            showProgress: false,
            showBullets: true,
            hidePrev: true,
            steps: [
              {
                title: 'Welcome',
                intro: '欢迎访问 HelloGitHub 👋',
              },
              ...steps.map((step) => {
                return {
                  ...step,
                  element: document.querySelector(`${step.element}`),
                  intro: step.description,
                };
              }),
            ],
          })
          .onbeforeexit(() => {
            console.log('退出');
            // 弹出信封, 点击跳转网站说明
          })
          .start();
        localStorage.setItem('hasGuided', 'true');
      }, 1000);
    }
  }, [isLogin]);

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
        <ul
          id='headMenu'
          className='text-md flex items-center space-x-2 font-medium text-gray-500 dark:text-gray-400 md:pt-2'
        >
          {/* pc 端显示的顶部按钮 */}
          <li id='home' className={liClassName('/')}>
            <HeaderBtn pathname='/'>
              <AiOutlineHome className='mr-0.5' />
              <span>首页</span>
            </HeaderBtn>
          </li>
          <li className={liClassName('/periodical/volume')}>
            <HeaderBtn pathname='/periodical/volume'>
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
