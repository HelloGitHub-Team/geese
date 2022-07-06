import * as React from 'react';
import { useState } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Status from '@/components/layout/Status';
import User from '@/components/layout/User';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const [loginStatus, setLoginStatus] = useState<boolean>(false);

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
                    <User
                      isLogin={loginStatus}
                      updateLoginStatus={updateLoginStatus}
                    ></User>
                    <Status />
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
