import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import NProgress from 'nprogress';
import { useEffect } from 'react';

import 'nprogress/nprogress.css';
import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { LoginProvider } from '@/hooks/useLoginContext';

import Layout from '@/components/layout/Layout';
import Alert from '@/components/message/Alert';
import PullRefresh from '@/components/PullRefresh';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  // 需要单页面展示的路由
  const singlePage: string[] = ['/404', '/500'];

  // 页面跳转时的加载进度条
  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <div id='root'>
      <Script id='baidu-analytics'>
        {`
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_ANALYTICS}";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
        `}
      </Script>
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
