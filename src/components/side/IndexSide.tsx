import { useEffect, useRef, useState } from 'react';

import Ad from '@/components/side/Ad';

import Status from './Status';
import UserStatus from './UserStatus';
import Footer from '../layout/Footer';

export default function IndexSide() {
  const [displayAdOnly, setDisplayAdOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        <div className='mt-2 ml-3'>
          <div className='space-y-2'>
            <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5'>
              <UserStatus></UserStatus>
            </div>
            <Ad
              id='upyun'
              image='https://img.hellogithub.com/ad/side_upyun.png'
              url='https://www.upyun.com/overseasActivities'
            />
            <Ad
              id='ucloud'
              image='https://img.hellogithub.com/ad/ucloud.png'
              url='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'
            />
            <Status />
          </div>
          <Footer />
        </div>
      </div>
      <div
        className='fixed top-16 ml-3 w-[180px] space-y-2 lg:w-[244px]'
        hidden={!displayAdOnly}
      >
        <Ad
          id='upyun'
          image='https://img.hellogithub.com/ad/side_upyun.png'
          url='https://www.upyun.com/overseasActivities'
        />
        <Ad
          id='ucloud'
          image='https://img.hellogithub.com/ad/ucloud.png'
          url='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'
        />
      </div>
    </>
  );
}
