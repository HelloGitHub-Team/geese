import Link from 'next/link';
import { useMemo } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import { useLoginContext } from '@/hooks/useLoginContext';

import { DEFAULT_AVATAR } from '@/utils/constants';

import SideLoginButton from './SideLoginButton';
import Loading from '../loading/Loading';
import ThemeSwitch from '../ThemeSwitch';

export default function UserStatus() {
  const { userInfo, isValidating, isLogin, logout } = useLoginContext();
  const levelPercent = useMemo(() => {
    if (
      typeof userInfo?.contribute === 'number' &&
      typeof userInfo?.next_level_score === 'number'
    ) {
      return (userInfo?.contribute / userInfo?.next_level_score) * 100;
    }
    // next_level_score 为 null 时则达到了最大等级
    if (!userInfo?.next_level_score) {
      return 100;
    }
    return 0;
  }, [userInfo]);

  return (
    <>
      {!isValidating || isLogin ? (
        <>
          {isLogin && userInfo?.success ? (
            <>
              <div className='relative'>
                <div className='flex'>
                  <Link href={`/user/${userInfo.uid}`}>
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
                  </Link>
                  <div className='ml-2 w-full shrink grow'>
                    <div className='relative flex h-5 min-w-0 items-center'>
                      <div className='block w-14 truncate align-baseline dark:text-gray-300 lg:w-24'>
                        {userInfo?.nickname}
                      </div>
                      <div className='shrink grow'></div>
                      <div className='justify-end'>
                        <ThemeSwitch />
                      </div>
                    </div>
                    <div className='text-sm font-bold text-blue-500'>
                      Lv.{userInfo?.level}
                    </div>
                  </div>
                </div>
                {/* 等级展示 */}
                <div className='mt-1'>
                  <div className='flex justify-between text-sm'>
                    <div className='cursor-pointer text-gray-400'>
                      <Link prefetch={false} href='/help/level'>
                        <a>
                          <span className='align-[-5px] text-xs'>
                            <span className='mr-0.5'>贡献值</span>
                            <span className='inline-block align-[-2px]'>
                              <AiOutlineQuestionCircle />
                            </span>
                          </span>
                        </a>
                      </Link>
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
                      style={{
                        width: `${levelPercent}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className='mt-3 flex justify-between border-t text-xs dark:border-gray-700'>
                <Link href={`/user/${userInfo?.uid}`} className='block'>
                  <a>
                    <div className='pl-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'>
                      我的主页
                    </div>
                  </a>
                </Link>
                {userInfo.permission?.code == 'super' ? (
                  <a href='/taichi/'>
                    <div className='cursor-pointer pr-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'>
                      管理后台
                    </div>
                  </a>
                ) : (
                  <div
                    className='cursor-pointer pr-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'
                    onClick={logout}
                  >
                    退出登录
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <SideLoginButton />
            </>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
