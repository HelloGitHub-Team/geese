import { useRouter } from 'next/router';

import Button from './Button';

export const RankButton = () => {
  const router = useRouter();
  return (
    <Button
      className='font-normal text-gray-500'
      variant='ghost'
      onClick={() => {
        router.push('/report/tiobe');
      }}
    >
      排行榜
    </Button>
  );
};
