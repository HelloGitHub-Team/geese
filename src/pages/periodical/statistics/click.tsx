import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';

import RedirectBar from '@/components/navbar/RedirectBar';
import Seo from '@/components/Seo';

import { redirectRecord } from '@/services/home';

const RedirectPage: NextPage = () => {
  const { t, i18n } = useTranslation('common');

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
        text={t('redirect')}
        target={target as string}
        i18n_lang={i18n.language}
      />
    </>
  );
};

export default RedirectPage;
