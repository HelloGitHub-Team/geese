import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AiOutlineBell, AiOutlineQuestionCircle } from 'react-icons/ai';

import { useLoginContext } from '@/hooks/useLoginContext';

import { NoPrefetchLink } from '@/components/links/CustomLink';

import { DEFAULT_AVATAR } from '@/utils/constants';

import SideLoginButton from './SideLoginButton';

import { SideProps } from '@/types/home';

export default function UserStatus({ t }: SideProps) {
  const router = useRouter();
  const { userInfo, isLogin, logout } = useLoginContext();
  const levelPercent = useMemo(() => {
    if (
      typeof userInfo?.contribute === 'number' &&
      typeof userInfo?.next_level_score === 'number'
    ) {
      return (userInfo.contribute / userInfo?.next_level_score) * 100;
    }
    // next_level_score 为 null 时则达到了最大等级
    return !userInfo?.next_level_score ? 100 : 0;
  }, [userInfo]);

  if (!isLogin || !userInfo?.success) {
    return <SideLoginButton text={t('user_side.login')} />;
  }

  return (
    <div className='relative'>
      <div className='flex'>
        <NoPrefetchLink href={`/user/${userInfo.uid}`}>
          <a>
            <div className='bg-img top-0 left-0 h-10 w-10 shrink-0 grow-0 cursor-pointer rounded-lg object-cover'>
              <img
                className='rounded'
                width='40'
                height='40'
                src={userInfo?.avatar || DEFAULT_AVATAR}
                alt='side_avatar'
              />
            </div>
          </a>
        </NoPrefetchLink>
        <div className='ml-2 w-full'>
          <div className='relative flex h-5 items-center'>
            <div className='block w-14 truncate align-baseline font-medium dark:text-gray-300 lg:w-24'>
              {userInfo.nickname}
            </div>
            <div className='flex-grow' />
            <div className='justify-end'>
              <div
                className='flex cursor-pointer flex-row'
                onClick={() => {
                  router.push('/notification');
                }}
              >
                <span className='relative inline-block'>
                  <AiOutlineBell
                    size={20}
                    className='text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500'
                  />
                  {userInfo?.unread.total > 0 && (
                    <span className='absolute top-0.5 right-0 flex h-1.5 w-1.5 translate-x-1/2 -translate-y-1/2'>
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
                      <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500' />
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className='text-sm font-bold text-blue-500'>
            Lv.{userInfo.level}
          </div>
        </div>
      </div>
      {/* 等级展示 */}
      <div className='mt-1'>
        <div className='flex justify-between text-sm'>
          <div className='cursor-pointer text-gray-400'>
            <NoPrefetchLink href='/help/level'>
              <a className='align-[-5px] text-xs'>
                <span className='mr-0.5'>
                  {t('user_side.contribute_label')}
                </span>
                <AiOutlineQuestionCircle className='inline-block align-[-2px]' />
              </a>
            </NoPrefetchLink>
          </div>
          <span className='text-xl text-blue-500'>
            {userInfo.contribute}
            <span className='mx-0.5'>/</span>
            {userInfo.next_level_score || 'Max'}
          </span>
        </div>
        <div className='flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
          <div
            className='flex flex-col justify-center overflow-hidden bg-blue-500'
            style={{ width: `${levelPercent}%` }}
          />
        </div>
      </div>
      <div className='mt-3 flex justify-between border-t text-xs dark:border-gray-700'>
        <NoPrefetchLink href={`/user/${userInfo.uid}`}>
          <a className='pl-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'>
            {t('user_side.profile')}
          </a>
        </NoPrefetchLink>
        {userInfo.permission?.code == 'super' ? (
          <a href='/taichi/'>
            <div className='pr-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'>
              {t('user_side.admin')}
            </div>
          </a>
        ) : (
          <div
            className='cursor-pointer pr-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'
            onClick={logout}
          >
            {t('user_side.logout')}
          </div>
        )}
      </div>
    </div>
  );
}
