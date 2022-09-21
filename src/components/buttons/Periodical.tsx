import { useRouter } from 'next/router';

import Button from '@/components/buttons/Button';

import { getVolumeNum } from '@/services/volume';

const PeriodicalButton = () => {
  const router = useRouter();

  const handlePeriodicalURL = async () => {
    const { data, lastNum } = await getVolumeNum();
    if (data) {
      router.push(`/periodical/volume/${lastNum}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <li className='block'>
        <Button
          className='hidden font-normal text-gray-500 dark:text-gray-400 md:block'
          variant='ghost'
          onClick={handlePeriodicalURL}
        >
          月刊
        </Button>
      </li>
    </>
  );
};
export default PeriodicalButton;

export const getPeriodicalPath = async () => {
  const { data, lastNum } = await getVolumeNum();
  if (data) {
    return `/periodical/volume/${lastNum}`;
  } else {
    return '/';
  }
};
