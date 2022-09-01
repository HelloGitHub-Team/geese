import Image from 'next/image';
import { useRouter } from 'next/router';

import LoginButton from '../buttons/LoginButton';
import LogoutButton from '../buttons/LogoutButton';
import PeriodicalButton from '../buttons/Periodical';
import SearchInput from '../search/SearchInput';

import { LoginStatusProps } from '@/types/user';

const Header = ({ loginStatus, updateLoginStatus }: LoginStatusProps) => {
  const router = useRouter();

  const showMessage = () => {
    router.push('/');
  };

  return (
    <div className='fixed z-10 h-14 w-full bg-white shadow-sm'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between p-2'>
        <span className='hidden md:block'>
          <Image
            className='h-8 cursor-pointer'
            src='https://raw.githubusercontent.com/521xueweihan/img_logo/main/logo/logo.png'
            width='28'
            height='28'
            alt='hellogithub'
            onClick={showMessage}
          />
        </span>
        <SearchInput />
        <ul className='text-md flex items-center space-x-2 font-medium text-gray-500'>
          <li className='md:block'>
            <PeriodicalButton></PeriodicalButton>
          </li>
          <>
            {!loginStatus ? (
              <li className='block md:hidden'>
                <LoginButton></LoginButton>
              </li>
            ) : (
              <li className='hidden md:block '>
                <LogoutButton updateLoginStatus={updateLoginStatus} />
              </li>
            )}
          </>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
