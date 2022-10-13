import { useRouter } from 'next/router';
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineArticle } from 'react-icons/md';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import RankButton from '@/components/buttons/RankButton';
import AvatarWithDropdown from '@/components/dropdown/AvatarWithDropdown';
import ThemeSwitch from '@/components/ThemeSwitch';

import LoginButton from '../buttons/LoginButton';
import PeriodicalButton from '../buttons/Periodical';
import SearchInput from '../search/SearchInput';

const Header = () => {
  const router = useRouter();
  const { isLogin } = useLoginContext();

  return (
    <div className='fixed z-10 h-14 w-full bg-white shadow-sm backdrop-blur dark:border dark:border-gray-50/[0.06] dark:bg-transparent'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between p-2 xl:max-w-5xl 2xl:max-w-7xl'>
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
