import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { LoginProvider } from '@/hooks/useLoginContext';

import Layout from '@/components/layout/Layout';
import PullRefresh from '@/components/PullRefresh';

//#region  //*=========== 动态加载,以提高首页加载速度 ===========
const Alert = dynamic(() => import('@/components/message/Alert'));
//#endregion  //*=======动态加载,以提高首页加载速度=  ===========

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  // 需要单页面展示的路由
  const singlePage: string[] = ['/404', '/500'];

  return (
    <div id='root'>
      <LoginProvider>
        <PullRefresh>
          {singlePage.includes(pathname) ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </PullRefresh>
        <div id='alert'>
          <Alert />
        </div>
      </LoginProvider>
    </div>
  );
}

export default MyApp;
