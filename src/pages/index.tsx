import { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';

import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { HomeItemData } from '@/pages/api/home';
import HomeView from '@/views/Home';

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
      <HomeView />
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
