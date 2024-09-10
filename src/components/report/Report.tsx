import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { IoMdRemove, IoMdTrendingDown, IoMdTrendingUp } from 'react-icons/io';

import { RankDataItem } from '@/types/rank';

export const ChangeColumnRender = (
  row: RankDataItem,
  showPercent = false,
  i18n_lang: string
) => {
  let text = '-';
  if (row.change !== null) {
    text = showPercent ? `${row.change}%` : `${row.change}`;
  }

  return (
    <div className='flex items-center'>
      {i18n_lang === 'en' ? (
        row.change < 0 ? (
          <AiFillCaretDown className='text-red-500' />
        ) : (
          <AiFillCaretUp className='text-green-500' />
        )
      ) : row.change < 0 ? (
        <AiFillCaretDown className='text-green-500' />
      ) : (
        <AiFillCaretUp className='text-red-500' />
      )}
      <span className='ml-1'>{text}</span>
    </div>
  );
};

export const TrendColumnRender = (
  row: RankDataItem,
  _showPercent: boolean,
  i18n_lang: string
) => {
  let icon = <IoMdRemove size={16} />;
  if (row.change !== null) {
    if (row.change > 0) {
      if (i18n_lang === 'en') {
        icon = <IoMdTrendingUp size={16} className='text-green-500' />;
      } else {
        icon = <IoMdTrendingUp size={16} className='text-red-500' />;
      }
    } else {
      if (i18n_lang === 'en') {
        icon = <IoMdTrendingDown size={16} className='text-red-500' />;
      } else {
        icon = <IoMdTrendingDown size={16} className=' text-green-500' />;
      }
    }
  }
  return <span>{icon}</span>;
};
