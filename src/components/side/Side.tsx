import { useEffect, useRef, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import Footer from '@/components/layout/Footer';
import { SideAd, SideFixAd } from '@/components/side/SideAd';
import SiteStats from '@/components/side/Stats';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import Recommend from './Recommend';
import UserStatus from './UserStatus';

import { AdvertItems } from '@/types/home';

interface Props {
  index: boolean;
}

export const Side = ({ index }: Props) => {
  const [displayAdOnly, setDisplayAdOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isValidating } = useSWRImmutable<AdvertItems>(
    makeUrl('/advert/', { position: 'side' }),
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const adverts = data?.success ? data.data : [];

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
        <div className='relative mt-2 ml-3 max-w-[244px]'>
          <div className='space-y-2'>
            <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5 dark:bg-gray-800'>
              <UserStatus />
            </div>
            {!isValidating ? <SideAd data={adverts} /> : <></>}
            {index ? <SiteStats /> : <Recommend />}
          </div>
          {index ? <Footer /> : <></>}
        </div>
      </div>
      {adverts ? (
        <SideFixAd data={adverts} displayAdOnly={displayAdOnly} />
      ) : (
        <></>
      )}
    </>
  );
};
