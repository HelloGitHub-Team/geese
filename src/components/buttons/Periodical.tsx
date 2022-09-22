import { useRouter } from 'next/router';
import { MdOutlineArticle } from 'react-icons/md';

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
      <Button
        className='font-normal text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        variant='ghost'
        onClick={handlePeriodicalURL}
      >
        <MdOutlineArticle className='mr-0.5' />
        月刊
      </Button>
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
