import { AppProps } from 'next/app';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import Layout from '@/components/layout/Layout';
import { Alert } from '@/components/message/Alert';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div id='root'>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <div id='alert'>
        <Alert />
      </div>
    </div>
  );
}

export default MyApp;
