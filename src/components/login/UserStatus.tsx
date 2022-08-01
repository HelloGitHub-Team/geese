import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import Loading from '../loading/Loading';
import SideLoginButton from '../side/SideLoginButton';

import { UserProps, UserStatusProps } from '@/types/user';

import { DEFAULT_AVATAR } from '~/constants';

const TOKENKEY = 'Authorization';

export default function UserStatus({ isLogin, updateLoginStatus }: UserProps) {
  const [hasToken, setHasToken] = useState<boolean>(false);

  const getToken = () => localStorage.getItem(TOKENKEY);
  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  const { data, isValidating } = useSWR<UserStatusProps>(
    hasToken ? makeUrl('/user/me/') : null,
    (key) => {
      const headers = { [TOKENKEY]: `Bearer ${getToken()}` };
      return fetcher(key, { headers });
    },
    {
      revalidateIfStale: false,
      onSuccess: function () {
        updateLoginStatus(true);
      },
      onError: function () {
        updateLoginStatus(false);
        localStorage.clear();
      },
    }
  );

  return (
    <>
      {!isValidating ? (
        <div>
          {isLogin ? (
            <>
              <div className='relative'>
                <Link href={data?.uid ? '/users/' + data?.uid : '_blank'}>
                  <span className='bg-img absolute top-0 left-0 h-10 w-10 shrink-0 grow-0 rounded-lg object-cover'>
                    <Image
                      width={40}
                      height={40}
                      alt='Picture of the author'
                      src={data?.avatar || DEFAULT_AVATAR}
                    ></Image>
                  </span>
                </Link>
                <div className='shrink grow pl-12'>
                  <div className='flex min-w-0 items-center'>
                    <a
                      className='mr-2 block h-5 shrink grow truncate text-sm hover:underline'
                      href='/users/314838220949536768'
                    >
                      {data?.nickname}
                    </a>
                  </div>
                  <div className='text-sm font-bold text-yellow-500'>Lv1</div>
                </div>
              </div>

              <div className='flex items-end pt-2 text-sm'>
                <Link href='/create/repo/'>
                  <a className='flex h-8 items-center rounded-lg bg-blue-500 pl-4 pr-4 text-sm text-white active:bg-blue-600'>
                    分享项目
                  </a>
                </Link>
                <div className='shrink grow'></div>
                <div className='pr-2 pb-0.5 text-slate-400'>积分</div>
                <div className='text-4xl font-bold text-yellow-500'>15</div>
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
