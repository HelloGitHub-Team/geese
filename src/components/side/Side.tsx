import { useTranslation } from 'next-i18next/pages';
import { useEffect, useRef, useState } from 'react';

import { useSponsor } from '@/hooks/useSponsor';

import Footer from '@/components/layout/Footer';
import { SideAd, SideFixAd } from '@/components/side/SideAd';
import SiteStats from '@/components/side/Stats';

import Recommend from './Recommend';
import UserStatus from './UserStatus';

interface Props {
  isHome: boolean;
  topValue: string;
}

export const Side = ({ isHome, topValue }: Props) => {
  const { t, i18n } = useTranslation('common');
  const [displayAdOnly, setDisplayAdOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { sideAds, isValidating } = useSponsor();

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { bottom } = containerRef.current.getBoundingClientRect();
        setDisplayAdOnly(bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <>
      <div ref={containerRef}>
        <div className='relative ml-3 mt-2 max-w-[244px]'>
          <div className='space-y-2'>
            <div className='rounded-lg bg-white pb-2.5 pl-3 pr-3 pt-3 dark:bg-gray-800'>
              <UserStatus t={t} i18n_lang={i18n.language} />
            </div>
            {!isValidating && (
              <SideAd data={sideAds} t={t} i18n_lang={i18n.language} />
            )}
            {isHome ? <SiteStats t={t} /> : <Recommend t={t} />}
          </div>
          {isHome ? (
            <Footer t={t} isLite={false} />
          ) : (
            <Footer t={t} isLite={true} />
          )}
        </div>
      </div>
      {sideAds && (
        <SideFixAd
          data={sideAds}
          displayAdOnly={displayAdOnly}
          t={t}
          i18n_lang={i18n.language}
          topValue={topValue}
        />
      )}
    </>
  );
};
