import { useEffect, useState } from 'react';

import { useLoginContext } from '@/hooks/useLoginContext';

import CustomLink from '@/components/links/CustomLink';
import ThemeSwitch from '@/components/ThemeSwitch';

import { DEFAULT_AVATAR } from '@/utils/constants';

const AvatarWithDropdown = (props: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, userInfo } = useLoginContext();

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
      <img
        className='relative inline overflow-hidden rounded-full'
        src={userInfo?.avatar || DEFAULT_AVATAR}
        width='28'
        height='28'
        alt='header_avatar'
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      />
      <div
        className='w-26 absolute right-1 mt-2 cursor-pointer rounded border bg-white py-2 text-gray-500 shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
        hidden={!isOpen}
      >
        <div className='absolute -top-1.5 right-3 h-3 w-3 rotate-45 border-l border-t bg-white dark:border-gray-600 dark:bg-gray-800'></div>
        <CustomLink href={`/user/${userInfo?.uid}`}>
          <div className='block px-4 leading-8 active:bg-gray-100 dark:active:bg-gray-700'>
            我的主页
          </div>
        </CustomLink>
        <CustomLink href='/notification'>
          <div className='block px-4 leading-8 active:bg-gray-100 dark:active:bg-gray-700'>
            消息中心
            {userInfo?.success && userInfo.unread.total > 0 ? (
              <span className='relative ml-1 inline-flex h-2 w-2 rounded-full bg-red-500' />
            ) : (
              <></>
            )}
          </div>
        </CustomLink>

        <div className='px-4 leading-8 active:bg-gray-100 dark:active:bg-gray-700'>
          <ThemeSwitch type='text'></ThemeSwitch>
        </div>
        <div
          className='px-4 leading-8 active:bg-gray-100 dark:active:bg-gray-700'
          onClick={logout}
        >
          退出
        </div>
      </div>
    </div>
  );
};

export default AvatarWithDropdown;
