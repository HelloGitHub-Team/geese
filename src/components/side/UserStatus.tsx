import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import useSWR from 'swr';

import { useLoginContext } from '@/hooks/useLoginContext';
import useToken from '@/hooks/useToken';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { DEFAULT_AVATAR } from '@/utils/constants';

import SideLoginButton from './SideLoginButton';
import Loading from '../loading/Loading';
import ThemeSwitch from '../ThemeSwitch';

import { UserStatusProps } from '@/types/user';

export default function UserStatus() {
  const { token } = useToken();
  const { isLogin, logout } = useLoginContext();
  const { data, isValidating } = useSWR<UserStatusProps>(
    token ? makeUrl('/user/me/') : null,
    (key) => {
      const headers = { Authorization: `Bearer ${token}` };
      return fetcher(key, { headers });
    }
  );
  const levelPercent = useMemo(() => {
    if (
      typeof data?.contribute === 'number' &&
      typeof data?.next_level_score === 'number'
    ) {
      return (data?.contribute / data?.next_level_score) * 100;
    }
    // next_level_score 为 null 时则达到了最大等级
    if (!data?.next_level_score) {
      return 100;
    }
    return 0;
  }, [data]);

  useEffect(() => {
    // 校验 token 过期的话，则清理本地存储的 token
    if (
      !isValidating &&
      isLogin &&
      typeof data?.success !== 'undefined' &&
      !data?.success
    ) {
      // 1. 请求 me 接口得到结果
      // 2. isLogin 为登录状态（这时有可能为过期token）
      // 3. 根据 me 接口的结果判断 token 是否过期
      // 4. isLogin 为 true 但 token 校验失败，则清理 localStorage
      localStorage.clear();
    }
  }, [data, isLogin, isValidating]);

  return (
    <>
      {!isValidating || isLogin ? (
        <div>
          {isLogin && data?.success ? (
            <>
              <div className='relative'>
                <div className='flex'>
                  <Link href={`/user/${data.uid}`}>
                    <a>
                      <div className='bg-img top-0 left-0 h-10 w-10 shrink-0 grow-0 cursor-pointer rounded-lg object-cover'>
                        <img
                          className='rounded'
                          width='40'
                          height='40'
                          src={data?.avatar || DEFAULT_AVATAR}
                          alt='side_avatar'
                        />
                      </div>
                    </a>
                  </Link>
                  <div className='ml-2 w-full shrink grow'>
                    <div className='relative flex h-5 min-w-0 items-center'>
                      <div className='block w-24 truncate align-baseline dark:text-gray-300'>
                        {data?.nickname}
                      </div>
                      <div className='shrink grow'></div>
                      <div className='flex justify-end'>
                        <ThemeSwitch />
                      </div>
                    </div>
                    <div className='text-sm font-bold text-blue-500'>Lv.1</div>
                  </div>
                </div>
                {/* 等级展示 */}
                <div className='mt-1'>
                  <div className='flex justify-between text-sm'>
                    <div className='cursor-pointer text-gray-400'>
                      <Link href='/help/level'>
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
                      {data.contribute}
                      <span className='mx-0.5'>/</span>
                      {data.next_level_score || 'Max'}
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
              <div className='mt-3 flex cursor-pointer justify-between border-t text-xs dark:border-gray-700'>
                <Link href={`/user/${data.uid}`} className='block'>
                  <a>
                    <div className='pl-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'>
                      我的主页
                    </div>
                  </a>
                </Link>
                <div
                  className='pr-1 pt-2 pb-1 text-gray-400 hover:text-blue-500 hover:underline'
                  onClick={logout}
                >
                  退出登录
                </div>
              </div>
            </>
          ) : (
            <>
              <SideLoginButton />
            </>
          )}
        </div>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
}
