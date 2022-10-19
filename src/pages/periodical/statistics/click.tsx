import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import RedirectBar from '@/components/navbar/RedirectBar';

import { redirectRecord } from '@/services/home';

const RedirectPage: NextPage = () => {
  const router = useRouter();

  const trackRedirect = (target: string) => {
    redirectRecord(target, '', 'repo');
  };

  useEffect(() => {
    if (router.isReady) {
      const { target = '/' } = router.query;
      trackRedirect(target as string);
      window.location.href = target as string;
    }
  }, [router]);

  return <RedirectBar />;
};

export default RedirectPage;
