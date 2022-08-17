import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getVolumeNum } from '@/services/volume';

const PeriodicalButton = () => {
  const router = useRouter();
  console.log(router);
  const [atPeriodical, setAtPeriodical] = useState<boolean>(false);

  const handlePeriodicalURL = async () => {
    const { data } = await getVolumeNum();
    const lastNum = data.at(0).num;
    if (data) {
      router.push(`/periodical/volume/${lastNum}`);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    setAtPeriodical(router.asPath.startsWith('/periodical/volume/'));
  }, [router]);
  return (
    <>
      {atPeriodical ? (
        <button
          onClick={() => {
            router.push('/');
          }}
        >
          <span className='inline-flex cursor-pointer items-center rounded-lg px-3 py-2'>
            首页
          </span>
        </button>
      ) : (
        <button onClick={handlePeriodicalURL}>
          <span className='inline-flex cursor-pointer items-center rounded-lg px-3 py-2'>
            月刊
          </span>
        </button>
      )}
    </>
  );
};
export default PeriodicalButton;
