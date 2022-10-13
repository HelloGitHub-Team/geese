import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useLoginContext } from '@/hooks/useLoginContext';

import ThemeSwitch from '@/components/ThemeSwitch';

//#region  //*=========== 动态加载,以提高首次加载速度 ===========
const AiOutlineHome = dynamic(() =>
  import('react-icons/ai').then((mod) => mod.AiOutlineHome)
);
const MdOutlineArticle = dynamic(() =>
  import('react-icons/md').then((mod) => mod.MdOutlineArticle)
);
const Button = dynamic(() => import('@/components/buttons/Button'));
const RankButton = dynamic(() => import('@/components/buttons/RankButton'));
const LoginButton = dynamic(() => import('@/components/buttons/LoginButton'));
const PeriodicalButton = dynamic(
  () => import('@/components/buttons/Periodical')
);
const AvatarWithDropdown = dynamic(
  () => import('@/components/dropdown/AvatarWithDropdown')
);
const SearchInput = dynamic(() => import('@/components/search/SearchInput'));
//#endregion  //*=======动态加载,以提高首次加载速度=  ===========

const Header = () => {
  const router = useRouter();
  const { isLogin } = useLoginContext();

  return (
    <div className='fixed z-10 h-14 w-full bg-white shadow-sm backdrop-blur dark:border dark:border-gray-50/[0.06] dark:bg-transparent'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between p-2'>
        <span className='hidden md:block'>
          <img
            className='cursor-pointer dark:invert'
            src='https://img.hellogithub.com/logo/logo.png'
            width='28'
            height='28'
            alt='header_logo'
            onClick={() => {
              router.reload();
            }}
          />
        </span>
        <span className='block md:hidden'>
          <RankButton type='dropdown' />
        </span>
        <SearchInput />
        <ul className='text-md flex items-center space-x-2 font-medium text-gray-500 dark:text-gray-400'>
          <li className='hidden md:block'>
            <Button
              className='font-normal text-gray-500 hover:bg-transparent hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-700'
              variant='ghost'
              onClick={() => {
                router.push('/');
              }}
            >
              <AiOutlineHome className='mr-0.5' />
              首页
            </Button>
          </li>
          <li className='hidden md:block'>
            <PeriodicalButton />
          </li>
          <li className='hidden md:block'>
            <RankButton />
          </li>
          <li className='hidden md:block'>
            <Button
              className='font-normal text-gray-500  hover:bg-transparent hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-700'
              variant='ghost'
              onClick={() => {
                router.push('/article');
              }}
            >
              <MdOutlineArticle className='mr-0.5' />
              文章
            </Button>
          </li>
          <li className='hidden md:block'>
            <ThemeSwitch />
          </li>
          <li className='block md:hidden'>
            {!isLogin ? <LoginButton /> : <AvatarWithDropdown />}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
