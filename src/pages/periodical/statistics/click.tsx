import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import RedirectBar from '@/components/navbar/RedirectBar';

const Redict: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { target = '/' } = router.query;
      if (target) {
        window.location.href = target as string;
      }
    }
  }, [router]);

  return <RedirectBar />;
};

export default Redict;
