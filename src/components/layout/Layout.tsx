import * as React from 'react';
import { useState } from 'react';
import useSWRImmutable from 'swr';

import Header from '@/components/layout/Header';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import IndexSide from '../side/IndexSide';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  const updateLoginStatus = (value: boolean) => {
    setLoginStatus(value);
  };

  const { data } = useSWRImmutable<Record<string, any>>(
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

  return (
    <>
      <Header
        wechatOAtuhURL={data?.url}
        loginStatus={loginStatus}
        updateLoginStatus={updateLoginStatus}
      ></Header>
      <main className='container mx-auto px-0 pt-14 xl:px-40'>
        <div className='flex shrink grow flex-row sm:border-l sm:dark:border-slate-600 md:border-none'>
          <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
            {children}
          </div>
          <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
            <IndexSide
              wechatOAtuhURL={data?.url}
              loginStatus={loginStatus}
              updateLoginStatus={updateLoginStatus}
            ></IndexSide>
          </div>
        </div>
      </main>
    </>
  );
}
