import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

import { RankDataItem } from '@/types/rank';

export const ChangeColumnRender = (row: RankDataItem) => {
  let text = row.change;
  if (typeof text !== 'number') {
    text = '新上榜';
  } else {
    text = `${text}%`;
  }
  return (
    <div className='flex items-center'>
      {row.change < 0 ? (
        <AiFillCaretDown className='text-red-500' />
      ) : (
        <AiFillCaretUp className='text-green-500' />
      )}
      <span className='ml-1'>{text}</span>
    </div>
  );
};
