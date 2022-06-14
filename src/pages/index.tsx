import { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Items from '@/components/layout/Items';
import Layout from '@/components/layout/Layout';
import Status from '@/components/layout/Status';
import User from '@/components/layout/User';
import Seo from '@/components/Seo';

import { HomeItemData } from '@/pages/api/home';

import { CurrentUser } from './api/login';

type IndexProps = {
  itemsData: HomeItemData;
  sortBy: string;
};

const Index: NextPage<IndexProps> = ({ itemsData, sortBy }) => {
  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  const checkLogin = useCallback(async () => {
    try {
      const token = localStorage.getItem('Authorization');
      const user = await CurrentUser({ Authorization: `Bearer ${token}` });
      if (user == undefined) {
        localStorage.clear();
        setLoginStatus(false);
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
    <Layout>
      <Seo templateTitle='Home' />
      <Seo />
      <Header
        loginStatus={loginStatus}
        updateLoginStatus={updateLoginStatus}
      ></Header>
      <main className='container mx-auto px-5 md:px-0 xl:px-40'>
        <div className='flex min-h-screen shrink grow flex-row sm:border-l sm:dark:border-slate-600 md:border-none'>
          <Items></Items>
          <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
            <div className='relative flex h-full flex-col items-stretch'>
              <div className='mt-2 ml-3'>
                <div className='space-y-2'>
                  <User isLogin={true}></User>
                  <Status></Status>
                </div>
                <Footer></Footer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
//   // const { sort_by } = query;
//   // console.log(sort_by)
//   // res.setHeader(
//   //   'Cache-Control',
//   //   'public, s-maxage=10, stale-while-revalidate=59'
//   // );
//   // // const allItems = await getAllItems();

//   // return {
//   //   props: {
//   //     sortBy: sort_by
//   //     // itemsData: allItems.data,
//   //   },
//   // };
// };

export default Index;
