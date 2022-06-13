import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Sort from '@/components/layout/Sort';
import Status from '@/components/layout/Status';
import User from '@/components/layout/User';
import Seo from '@/components/Seo';

import { DataContext, getAllItems, HomeItemData } from '@/pages/api/home';

type IndexProps = {
  itemsData: HomeItemData;
  wechatOAuthURL: string;
};

const Index: NextPage<IndexProps> = ({ itemsData, wechatOAuthURL }) => {
  return (
    <Layout>
      <Seo templateTitle='Home' />
      <Seo />
      <Header></Header>
      <main className='container mx-auto px-5 md:px-0 xl:px-40'>
        <div className='flex min-h-screen shrink grow flex-row sm:border-l sm:dark:border-slate-600 md:border-none'>
          <div
            id='main-left'
            className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'
          >
            <Sort isLogin={true}></Sort>

            <div className='bg-content divide-y divide-slate-100 overflow-hidden'>
              <DataContext.Provider value={itemsData}>
                {itemsData.map((item) => (
                  <article key={item.item_id} className='mx-4'>
                    <div className='hover-gray relative -mx-4 cursor-pointer bg-white py-3 pl-4 pr-3 hover:bg-slate-50'>
                      <div className='pb-0.5'>
                        <Link href='/posts/'>
                          <div className='text-color-primary flex justify-between visited:text-slate-500 dark:visited:text-slate-400'>
                            <span className='truncate pt-1 text-base leading-snug'>
                              {item.title}
                            </span>
                            <span className='mt-1 ml-1 h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white'>
                              {item.comment_total}
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className='truncate pt-1 text-sm text-slate-400'>
                        {item.description}
                      </div>
                      <div className='flex items-center pt-2'>
                        <Link href='/users/320967928804700160'>
                          <img
                            width='20'
                            height='20'
                            src='https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132'
                            className='bg-img h-5 w-5 rounded'
                          ></img>
                        </Link>
                        <div className='flex shrink grow items-center overflow-x-hidden pl-2 text-sm text-slate-400'>
                          <Link href='/users/322392455870869504'>
                            <div className='text-color-primary whitespace-nowrap hover:underline'>
                              卤蛋
                            </div>
                          </Link>
                          <span className='pl-1 pr-1'>·</span>
                          <Link href='/users/322392455870869504'>
                            <div className='text-color-primary whitespace-nowrap hover:underline'>
                              Python
                            </div>
                          </Link>
                          <span className='pl-1 pr-1'>·</span>
                          <time>2 小时前</time>
                        </div>
                        <div className='whitespace-nowrap pl-2 text-sm text-slate-400'>
                          20 次查看
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </DataContext.Provider>
            </div>
          </div>

          <div
            id='main-right'
            className='relative hidden w-3/12 shrink-0 md:block md:grow-0'
          >
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const allItems = await getAllItems();
  // const OAuthURLRes = await getOAuthURL({url_type: 'geese'})
  // const OAuthData = await OAuthURLRes.json()
  // const cookie = OAuthURLRes.headers.get("set-cookie");
  // res.setHeader("set-cookie", cookie);

  return {
    props: {
      // wechatOAuthURL: OAuthData.url,
      itemsData: allItems.data,
    },
  };
};

export default Index;
