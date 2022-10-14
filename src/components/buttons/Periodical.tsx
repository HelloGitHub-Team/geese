import { useRouter } from 'next/router';
import { AiOutlineBook } from 'react-icons/ai';

import Button from '@/components/buttons/Button';

const PeriodicalButton = () => {
  const router = useRouter();

  const handlePeriodicalURL = async () => {
    router.push('/periodical/volume');
  };

  return (
    <>
      <Button
        className='font-normal text-gray-500 hover:bg-transparent hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-700'
        variant='ghost'
        onClick={handlePeriodicalURL}
      >
        <AiOutlineBook className='mr-0.5' />
        月刊
      </Button>
    </>
  );
};
export default PeriodicalButton;
