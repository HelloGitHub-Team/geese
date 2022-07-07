import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/pages/api/base';
import { UserStatus } from '@/pages/api/login';
import { makeUrl } from '@/utils/api';

type UserProps = {
  updateLoginStatus: (value: boolean) => void;
  isLogin: boolean;
};

type UserStatusProps = {
  user?: UserStatus;
};

const TOKENKEY = 'Authorization';

export default function User({ isLogin, updateLoginStatus }: UserProps) {
  const [hasToken, setHasToken] = useState<boolean>(false);

  const getToken = () => localStorage.getItem(TOKENKEY);

  useEffect(() => {
    // localStorage.setItem(
    //   'Authorization',
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4bmIzdmRrY2hhIiwicGVybWlzc2lvbiI6InZpc2l0b3IiLCJuaWNrbmFtZSI6Inh1IiwiZXhwIjoxNjU3Njk3NzkxfQ.Zc7lVqCvlQ_g5jHCqAssMAwPNu6MX6lhLTZUtRlmK0Q'
    // );
    setHasToken(!!getToken());
  }, [isLogin]);

  const { data: auth } = useSWRImmutable<Record<string, any>>(
    makeUrl(`/user/oauth/wechat/url/`, { url_type: 'geese' }),
    (key) => {
      const options: RequestInit = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      };
      return fetcher(key, options);
    },
    {
      shouldRetryOnError: false,
    }
  );

  const { data: userStatus } = useSWR<UserStatus>(
    hasToken ? makeUrl('/user/me/') : null,
    (key) => {
      const headers = { [TOKENKEY]: `Bearer ${getToken()}` };
      return fetcher(key, { headers });
    },
    {
      onSuccess: function () {
        updateLoginStatus(true);
      },
      onError: function () {
        localStorage.clear();
        updateLoginStatus(false);
      },
    }
  );

  const defaultAvatar = '';

  const UserStatus = ({ user }: UserStatusProps) => (
    <React.Fragment>
      <div className='relative'>
        {/* /users/314838220949536768 */}
        <Link href={user?.uid ? '/users/' + user.uid : '_blank'}>
          <span className='bg-img absolute top-0 left-0 h-10 w-10 shrink-0 grow-0 rounded-lg object-cover'>
            {/* https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132 */}
            <Image
              width={40}
              height={40}
              alt='Picture of the author'
              src={user?.avatar || defaultAvatar}
            ></Image>
          </span>
        </Link>
        <div className='shrink grow pl-12'>
          <div className='flex min-w-0 items-center'>
            <a
              className='mr-2 block h-5 shrink grow truncate text-sm hover:underline'
              href='/users/314838220949536768'
            >
              {user?.nickname}
            </a>
          </div>
          <div className='text-sm font-bold text-yellow-500'>Lv1</div>
        </div>
      </div>

      <div className='flex items-end pt-2 text-sm'>
        <div className='shrink grow'></div>
        <div className='pr-2 pb-0.5 text-slate-400'>我的积分</div>
        <div className='text-4xl font-bold text-yellow-500'>15</div>
      </div>
    </React.Fragment>
  );

  const NotLogin = () => (
    <div className='box-border py-6 text-center align-middle text-base'>
      <Link href={auth?.url || '/'}>
        <button
          type='button'
          className='button box-border rounded-md border-2 border-slate-400 px-3 py-2 text-white text-gray-500'
        >
          立即登录
        </button>
      </Link>
    </div>
  );

  return (
    <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5'>
      {isLogin ? <UserStatus user={userStatus} /> : <NotLogin />}
    </div>
  );
}
