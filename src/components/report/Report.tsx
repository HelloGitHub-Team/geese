import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { IoMdRemove, IoMdTrendingDown, IoMdTrendingUp } from 'react-icons/io';

import { RankDataItem } from '@/types/rank';

export const ChangeColumnRender = (row: RankDataItem) => {
  let text = '新上榜';
  if (row.change !== null) {
    text = `${row.change}`;
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

export const ChangePercentColumnRender = (row: RankDataItem) => {
  let text = '新上榜';
  if (row.change !== null) {
    text = `${row.change}%`;
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

export const TrendColumnRender = (row: RankDataItem) => {
  let icon = <IoMdRemove size={16} />;
  if (row.change !== null) {
    if (row.change > 0) {
      icon = <IoMdTrendingUp size={16} className='text-red-500' />;
    } else {
      icon = <IoMdTrendingDown size={16} className=' text-green-500' />;
    }
  }
  return (
    <>
      <span>{icon}</span>
    </>
  );
};
