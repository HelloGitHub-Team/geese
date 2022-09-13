import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { LoginProvider } from '@/hooks/useLoginContext';

import Layout from '@/components/layout/Layout';
import { AlertComp as Alert } from '@/components/message/Alert';
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
  return (
    <div id='root'>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
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
