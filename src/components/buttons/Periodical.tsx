import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Button from '@/components/buttons/Button';

import { getVolumeNum } from '@/services/volume';

const PeriodicalButton = () => {
  const router = useRouter();
  const [atPeriodical, setAtPeriodical] = useState<boolean>(false);

  const handlePeriodicalURL = async () => {
    const { data, lastNum } = await getVolumeNum();
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
        <Button
          className='font-normal text-gray-500'
          variant='ghost'
          onClick={() => {
            router.push('/');
          }}
        >
          首页
        </Button>
      ) : (
        <Button
          className='font-normal text-gray-500'
          variant='ghost'
          onClick={handlePeriodicalURL}
        >
          月刊
        </Button>
      )}
    </>
  );
};
export default PeriodicalButton;
