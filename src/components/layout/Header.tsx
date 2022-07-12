import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LoginStatusProps } from '@/typing/user';

import LoginOutButton from '../buttons/LoginOutButton';
import LoginLink from '../links/LoginLink';
import SearchInput from '../search/SearchInput';

const Header = ({
  loginStatus,
  updateLoginStatus,
  wechatOAtuhURL,
}: LoginStatusProps) => {
  const router = useRouter();

  return (
    <div className='fixed z-10 h-14 w-full bg-white shadow-md'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between p-2'>
        <Image
          className='h-8 cursor-pointer'
          src='https://raw.githubusercontent.com/521xueweihan/img_logo/main/logo/logo.png'
          width='28'
          height='28'
          alt='hellogithub'
          onClick={() => router.push('/')}
        />
        <SearchInput />
        <ul className='text-md flex items-center space-x-2 font-medium text-gray-500'>
          <li className='md:block'>
            <Link href='/' className='rounded-lg px-3 py-2'>
              月刊
            </Link>
          </li>
          <>
            {!loginStatus ? (
              <li className='block md:hidden'>
                <LoginLink wechatOAtuhURL={wechatOAtuhURL}></LoginLink>
              </li>
            ) : (
              <li className='hidden md:block '>
                <LoginOutButton updateLoginStatus={updateLoginStatus} />
              </li>
            )}
          </>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
