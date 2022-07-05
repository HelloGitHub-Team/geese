import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Status from '@/components/layout/Status';
import User from '@/components/layout/User';
import useSWRInfinite from 'swr/infinite';

import { getStats, Stats } from '@/pages/api/home';
import { CurrentUser, UserStatus } from '@/pages/api/login';
import { HomeResponse, Repository } from '@/utils/types/repoType';
import { makeUrl } from '@/utils/api';
import { fetcher } from '@/pages/api/base';
import router from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({} as Stats);
  const [userStatus, setUserStatus] = useState<UserStatus>({} as UserStatus);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const statsRes = await getStats();
      if (statsRes !== void 0) {
        setStats(statsRes);
      }
    } catch (err) {
      console.info(err);
    }
  }

  const checkLogin = useCallback(async () => {
    try {
      const token = localStorage.getItem('Authorization');
      const user = await CurrentUser({ Authorization: `Bearer ${token}` });
      if (user == undefined) {
        localStorage.clear();
        setLoginStatus(false);
      } else {
        setUserStatus(user as UserStatus);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    checkLogin();
    const token = localStorage.getItem('Authorization');
    if (token != undefined) {
      setLoginStatus(true);
    }
  }, [checkLogin]);

  const updateLoginStatus = (value: boolean) => {
    setLoginStatus(value);
  };
  return (
    <>
      <Header
        loginStatus={loginStatus}
        updateLoginStatus={updateLoginStatus}
      ></Header>
      <main className='container mx-auto pt-14 sm:px-0 md:px-0 xl:px-40'>
        <div className='flex shrink grow flex-row sm:border-l sm:dark:border-slate-600 md:border-none'>
          <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
            {children}
          </div>
          <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
            <div className='relative flex h-full flex-col items-stretch'>
              <div className='top-15 fixed w-2/12'>
                <div className='mt-2 ml-3'>
                  <div className='space-y-2'>
                    <User user={userStatus} isLogin={loginStatus}></User>
                    <Status stats={stats}></Status>
                  </div>
                  <Footer></Footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
