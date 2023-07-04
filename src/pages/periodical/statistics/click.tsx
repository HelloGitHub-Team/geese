import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import RedirectBar from '@/components/navbar/RedirectBar';
import Seo from '@/components/Seo';

import { redirectRecord } from '@/services/home';

const RedirectPage: NextPage = () => {
  const router = useRouter();
  const { target = '/' } = router.query;
  const trackRedirect = (target: string) => {
    redirectRecord(target, '', 'external');
  };

  useEffect(() => {
    if (router.isReady) {
      trackRedirect(target as string);
      window.location.href = target as string;
    }
  }, [router]);

  return (
    <>
      <Seo robots='noindex, nofollow' />
      <RedirectBar
        text='即将离开 HelloGitHub 社区，跳转到👇'
        target={target as string}
      />
    </>
  );
};

export default RedirectPage;
