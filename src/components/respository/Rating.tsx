import clsx from 'clsx';
import { GoStar, GoStarFill } from 'react-icons/go';

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
      {[1, 2, 3, 4, 5].map((rating) => {
        const selected = value >= rating;
        const Star = selected ? GoStarFill : GoStar;
        return (
          <Star
            key={rating}
            size={size}
            className={clsx(selected ? 'text-yellow-300' : 'text-gray-400', {
              'cursor-pointer': !disabled,
              'cursor-not-allowed opacity-50': disabled,
            })}
            onClick={() => handleClick(rating)}
          />
        );
      })}
    </div>
  );
}

export default Rating;
