import clsx from 'clsx';
import { GoStar } from 'react-icons/go';

import { NOOP } from '~/constants';

function Rating(props: { value: number; onChange?: (value: number) => void }) {
  const { value = 2, onChange = NOOP } = props;
  const size = 18;

  return (
    <div className='flex items-center'>
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 1,
        })}
        onClick={() => onChange(1)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 2,
        })}
        onClick={() => onChange(2)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 3,
        })}
        onClick={() => onChange(3)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 4,
        })}
        onClick={() => onChange(4)}
      />
      <GoStar
        size={size}
        className={clsx('cursor-pointer text-gray-400', {
          'text-yellow-300': value >= 5,
        })}
        onClick={() => onChange(5)}
      />
    </div>
  );
}

export default Rating;
