import { NOOP } from '~/constants';

function Rating(props: { value: number; onChange?: (value: number) => void }) {
  const { value, onChange = NOOP } = props;

  return (
    <div className='rating rating-sm'>
      <input
        type='radio'
        name='rating-1'
        className='mask mask-star'
        checked={value === 1}
        onClick={() => onChange(1)}
      />
      <input
        type='radio'
        name='rating-1'
        className='mask mask-star'
        checked={value === 2}
        onClick={() => onChange(2)}
      />
      <input
        type='radio'
        name='rating-1'
        className='mask mask-star'
        checked={value === 3}
        onClick={() => onChange(3)}
      />
      <input
        type='radio'
        name='rating-1'
        className='mask mask-star'
        checked={value === 4}
        onClick={() => onChange(4)}
      />
      <input
        type='radio'
        name='rating-1'
        className='mask mask-star'
        checked={value === 5}
        onClick={() => onChange(5)}
      />
    </div>
  );
}

export default Rating;
