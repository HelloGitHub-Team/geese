import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

  return (
    <>
      <div className='bg-white'>
        <div className='m-2'>
          <div className='flex py-2.5 pl-4 pr-3'>跳转中...</div>
        </div>
      </div>
    </>
  );
};

export default Redict;
