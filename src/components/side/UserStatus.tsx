import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useLoginContext } from '@/hooks/useLoginContext';
import useToken from '@/hooks/useToken';

import { RepoModal } from '@/components/respository/Submit';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { DEFAULT_AVATAR } from '@/utils/constants';

import Loading from '../loading/Loading';
import SideLoginButton from '../side/SideLoginButton';

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
      {!isValidating ? (
        <div>
          {isLogin && data?.success ? (
            <>
              <Link href={`/user/${data.uid}`}>
                <div className='relative cursor-pointer'>
                  <span className='bg-img absolute top-0 left-0 h-10 w-10 shrink-0 grow-0 rounded-lg object-cover'>
                    <Image
                      className='rounded'
                      width={40}
                      height={40}
                      alt='Picture of the author'
                      src={data?.avatar || DEFAULT_AVATAR}
                    ></Image>
                  </span>
                  <div className='shrink grow pl-12'>
                    <div className='flex min-w-0 items-center'>
                      <span className='mr-2 block h-5 shrink grow truncate text-sm hover:underline'>
                        {data?.nickname}
                      </span>
                    </div>
                    <div className='text-sm font-bold text-yellow-500'>Lv1</div>
                  </div>
                </div>
              </Link>
              <div className='flex items-end pt-2 text-sm'>
                <RepoModal>
                  <a className='flex h-8 cursor-pointer items-center rounded-lg bg-blue-500 pl-1 pr-1 text-xs text-white active:bg-blue-600 xl:pl-4 xl:pr-4 xl:text-sm'>
                    分享项目
                  </a>
                </RepoModal>
                <div className='shrink grow'></div>
                <div className='pr-2 pb-0.5 text-slate-400'>贡献值</div>
                <div className='text-3xl font-bold text-yellow-500 xl:text-3xl'>
                  {data?.contribute}
                </div>
              </div>

              <div className='mt-2 flex cursor-pointer justify-between border-t'>
                <Link href={`/user/${data.uid}`} className='block'>
                  <div className='pl-1 pt-2 pb-1 text-sm text-gray-400 hover:text-blue-500'>
                    我的主页
                  </div>
                </Link>
                <div
                  className='pr-1 pt-2 pb-1 text-sm text-gray-400 hover:text-blue-500'
                  onClick={logout}
                >
                  退出登录
                </div>
              </div>
            </>
          ) : (
            <SideLoginButton />
          )}
        </div>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
}
