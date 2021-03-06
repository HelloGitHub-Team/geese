import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import Layout from '@/components/layout/Layout';
import { AlertComp as Alert } from '@/components/message/Alert';

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
      {singlePage.includes(pathname) ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <div id='alert'>
        <Alert />
      </div>
    </div>
  );
}

export default MyApp;
