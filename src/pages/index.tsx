import { GetStaticProps, NextPage, } from 'next';
import * as React from 'react';

import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { DataContext, getAllItems, HomeItemData } from '@/pages/api/home';
import Link from 'next/link';

type IndexProps = {
  itemsData: HomeItemData;
};

const Index: NextPage<IndexProps> = ({ itemsData }) => {
  return (
    <Layout>
      <Seo templateTitle='Home' />
      <Seo />
      <Header isLogin={true}></Header>
      <main className='container mx-auto lg:px-40'>
        <div className='flex flex-row grow shrink min-h-screen sm:border-l sm:dark:border-slate-600 md:border-none'>
          <div className='relative w-0 grow shrink lg:grow-0 lg:w-9/12'>
            <div className='relative bg-white'>
              <div className='bg-content border-main-content overflow-hidden mb-2 mt-2'>
                <div className='flex pl-4 pr-3 py-2.5'>
                  <div className='flex items-center justify-start space-x-2'>
                    <Link className="flex items-center h-8 pl-3 pr-3 rounded-lg font-bold text-sm whitespace-nowrap hover:text-blue-500 hover:bg-slate-100 dark:bg-slate-700" href="/">热门</Link>
                    <Link className="flex items-center h-8 pl-3 pr-3 rounded-lg font-bold text-sm whitespace-nowrap text-blue-500 bg-slate-100 dark:bg-slate-700" href="2">最新</Link>
                  </div>
                </div>
              </div>
            </div>



            <DataContext.Provider value={itemsData}>
              {itemsData.map((item) => (
                <div key={item.item_id} className='divide-y divide-color-primary border-main-content overflow-hidden bg-content'>
                  <article className='mx-4'>
                    <div className='bg-white relative -mx-4 pl-4 pr-3 py-3 hover-gray cursor-pointer'>
                      <div className='pb-0.5'>
                        <Link className="flex justify-between text-color-primary visited:text-slate-500 dark:visited:text-slate-400" href="/posts/">
                          <span className="text-base leading-snug truncate pt-1">{item.title}111111111111111112sfasfasfsafasfasdf222222222222222222211111111111</span>
                          {/* <span className="mt-1 ml-1 whitespace-nowrap rounded-md h-4 py-0.5 px-2 text-xs leading-none text-white font-semibold bg-blue-400">{item.comment_total}</span> */}
                        </Link>
                      </div>
                      <div className="text-slate-400 text-sm truncate pt-1">
                        {item.description}
                      </div>
                      <div className="flex items-center pt-2">
                        <Link className="shrink-0 grow-0 grow-0 shrink-0" href="/users/320967928804700160">
                          <img width="20" height="20" src="https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132" className="w-5 h-5 rounded bg-img"></img>
                        </Link>
                        <div className="pl-2 text-slate-400 flex items-center text-sm grow shrink overflow-x-hidden">
                          <Link className="whitespace-nowrap hover:underline text-color-primary text-color-secondary" href="/users/322392455870869504">卤蛋</Link>
                          <span className="pl-1 pr-1">·</span><time>2 小时前</time>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
                // <div key={item.item_id}>{item.name}</div>
              ))}
            </DataContext.Provider>

          </div>

          <div className='bg-red-500 hidden md:block relative w-3/12 md:grow-0 shrink-0 ml-4 mt-2'></div>
        </div>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const allItems = await getAllItems();
  return {
    props: {
      itemsData: allItems.data,
    },
  };
};

export default Index;
