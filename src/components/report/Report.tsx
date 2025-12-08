import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { IoMdRemove, IoMdTrendingDown, IoMdTrendingUp } from 'react-icons/io';

import { LevelRender } from '@/components/user/Common';

import { NoPrefetchLink } from '../links/CustomLink';

import { RankDataItem } from '@/types/rank';

export const ChangeColumnRender = (
  row: RankDataItem,
  showPercent = false,
  i18n_lang: string
) => {
  if (row.change === null) {
    return <span>-</span>;
  }

  const text = showPercent ? `${row.change}%` : `${row.change}`;

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

// 分数+趋势合并列
export const RatingWithTrendRender = (
  row: RankDataItem,
  _showPercent: boolean,
  i18n_lang: string
) => {
  let icon = null;
  if (row.change !== null) {
    if (row.change > 0) {
      if (i18n_lang === 'en') {
        icon = <IoMdTrendingUp size={14} className='text-green-500' />;
      } else {
        icon = <IoMdTrendingUp size={14} className='text-red-500' />;
      }
    } else {
      if (i18n_lang === 'en') {
        icon = <IoMdTrendingDown size={14} className='text-red-500' />;
      } else {
        icon = <IoMdTrendingDown size={14} className='text-green-500' />;
      }
    }
  }
  return (
    <div className='flex items-center gap-1'>
      <span>{row.rating}</span>
      {icon}
    </div>
  );
};

export const ContributionColumnRender = (
  row: RankDataItem,
  _showPercent: boolean,
  i18n_lang: string
) => {
  let text = '-';
  if (row.change !== 0) {
    text = `+${row.change}`;
  } else {
    return <span>{text}</span>;
  }

  return (
    <div className='flex items-center'>
      {i18n_lang === 'en' ? (
        <span className='text-green-500'>{text}</span>
      ) : (
        <span className='text-red-500'>{text}</span>
      )}
    </div>
  );
};

export const UserColumnRender = (row: RankDataItem) => {
  return (
    <NoPrefetchLink href={`/user/${row.uid}`}>
      <div className='flex cursor-pointer items-center'>
        <img
          width='20'
          height='20'
          src={row.avatar}
          alt={`${row.name} avatar`}
          className='block rounded'
        />
        <span className='ml-1 '>{row.name}</span>
      </div>
    </NoPrefetchLink>
  );
};

export const PositionColumnRender = (row: RankDataItem) => {
  const positionList = ['🥇', '🥈', '🥉'];
  return (
    <div className='flex items-center'>
      {row.position > 3 ? (
        <span>{row.position}</span>
      ) : (
        <span>{positionList[row.position - 1]}</span>
      )}
    </div>
  );
};

export const LevelColumnRender = (
  row: RankDataItem,
  _showPercent: boolean,
  i18n_lang: string
) => {
  return LevelRender(row.rating as number, true, i18n_lang);
};
