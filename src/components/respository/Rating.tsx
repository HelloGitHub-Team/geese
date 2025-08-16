import clsx from 'clsx';
import { GoStar } from 'react-icons/go';

import { NOOP } from '@/utils/constants';

function Rating(props: {
  value: number;
  size?: number;
  onRateChange?: (value: number) => void;
  disabled?: boolean;
}) {
  const { value = 5, onRateChange = NOOP, size = 18, disabled = false } = props;

  const handleClick = (rating: number) => {
    if (!disabled) {
      onRateChange(rating);
    }
  };

  return (
    <div className='flex items-center'>
      <GoStar
        size={size}
        className={clsx('text-gray-400', {
          'text-yellow-300': value >= 1,
          'cursor-pointer': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        })}
        onClick={() => handleClick(1)}
      />
      <GoStar
        size={size}
        className={clsx('text-gray-400', {
          'text-yellow-300': value >= 2,
          'cursor-pointer': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        })}
        onClick={() => handleClick(2)}
      />
      <GoStar
        size={size}
        className={clsx('text-gray-400', {
          'text-yellow-300': value >= 3,
          'cursor-pointer': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        })}
        onClick={() => handleClick(3)}
      />
      <GoStar
        size={size}
        className={clsx('text-gray-400', {
          'text-yellow-300': value >= 4,
          'cursor-pointer': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        })}
        onClick={() => handleClick(4)}
      />
      <GoStar
        size={size}
        className={clsx('text-gray-400', {
          'text-yellow-300': value >= 5,
          'cursor-pointer': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        })}
        onClick={() => handleClick(5)}
      />
    </div>
  );
}

export default Rating;
