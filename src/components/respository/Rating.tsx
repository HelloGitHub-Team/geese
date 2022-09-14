import clsx from 'clsx';
import { GoStar } from 'react-icons/go';

import { NOOP } from '@/utils/constants';

function Rating(props: {
  value: number;
  onRateChange?: (value: number) => void;
}) {
  const { value = 5, onRateChange = NOOP } = props;
  const size = 18;

  return (
    <div className='flex items-center'>
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 1,
        })}
        onClick={() => onRateChange(1)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 2,
        })}
        onClick={() => onRateChange(2)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 3,
        })}
        onClick={() => onRateChange(3)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 4,
        })}
        onClick={() => onRateChange(4)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 5,
        })}
        onClick={() => onRateChange(5)}
      />
    </div>
  );
}

export default Rating;
