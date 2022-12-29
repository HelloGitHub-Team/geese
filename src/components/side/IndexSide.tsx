import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import { SideAd, SideFixAd } from '@/components/side/SideAd';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import Status from './Status';
import UserStatus from './UserStatus';
import Footer from '../layout/Footer';

import { AdvertItems } from '@/types/home';

export default function IndexSide() {
  const router = useRouter();
  const { pathname } = router;
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
              <UserStatus></UserStatus>
            </div>
            {!isValidating ? <SideAd data={adverts} /> : <></>}
            {pathname == '/' ? <Status /> : <></>}
          </div>
          <Footer />
        </div>
      </div>
      {adverts ? (
        <SideFixAd data={adverts} displayAdOnly={displayAdOnly} />
      ) : (
        <></>
      )}
    </>
  );
}
