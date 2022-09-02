import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/hooks/useLoginContext';
import useUserInfo from '@/hooks/useUserInfo';

import LogoutButton from '@/components/buttons/LogoutButton';

import LoginButton from '../buttons/LoginButton';
import PeriodicalButton from '../buttons/Periodical';
import SearchInput from '../search/SearchInput';

import { DEFAULT_AVATAR } from '~/constants';

const AvatarWithDropdown = (props: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLoginContext();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    const handleDocumentClick = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className={`${props.className} h-7 w-7`}>
      <Image
        className='relative overflow-hidden rounded-full'
        src={userInfo.avatar || DEFAULT_AVATAR}
        alt='头像'
        width={28}
        height={28}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      />
      <div
        className='absolute right-1 mt-2 w-32 rounded border bg-white py-2 shadow-md'
        hidden={!isOpen}
      >
        <div className='absolute -top-1.5 right-3 h-3 w-3 rotate-45 border-l border-t bg-white'></div>
        <Link href='/' className='block'>
          <div className='block px-4 leading-8 active:bg-gray-100'>
            我的首页
          </div>
        </Link>
        <div className='px-4 leading-8 active:bg-gray-100' onClick={logout}>
          退出
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const router = useRouter();
  const { isLogin } = useLoginContext();

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
            {!isLogin ? (
              <li className='block md:hidden'>
                <LoginButton></LoginButton>
              </li>
            ) : (
              <>
                <li className='hidden md:block '>
                  <LogoutButton />
                </li>
                <AvatarWithDropdown className='md:hidden' />
              </>
            )}
          </>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
