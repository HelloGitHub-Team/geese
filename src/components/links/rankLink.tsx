import { useMemo } from 'react';

import { NoPrefetchLink } from '@/components/links/CustomLink';

import { constructURL } from '@/utils/util';

import { RankItem } from '@/types/home';

interface Props {
  year?: number;
  month?: number;
  tid?: string;
  sort_by: string;
  rank_by: string;
  items: RankItem[];
}

export default function RankLink({
  year,
  month,
  tid,
  sort_by,
  rank_by,
  items,
}: Props) {
  const { yearNum, monthlyYearNum, monthNum } = useMemo(() => {
    const currentDate = new Date();
    const defaultYear = currentDate.getFullYear();
    const defaultMonth = currentDate.getMonth(); // 上个月，如果是1月则为0

    return {
      yearNum: year ?? defaultYear - 1,
      monthlyYearNum:
        year ?? (defaultMonth === 0 ? defaultYear - 1 : defaultYear),
      monthNum: month ?? (defaultMonth === 0 ? 12 : defaultMonth),
    };
  }, [year, month]);

  const renderLink = (item: RankItem) => {
    const isActive = item.month
      ? item.key === `${monthlyYearNum}.${monthNum}`
      : item.key === `${yearNum}`;

    const linkProps = {
      href: constructURL({
        sort_by,
        rank_by,
        tid,
        year: item.year,
        ...(item.month && { month: item.month }),
      }),
    };

    const className = `
      mr-1 inline-flex h-6 items-center justify-center rounded-xl px-2
      ${
        isActive
          ? 'bg-gray-100 text-blue-500 dark:bg-gray-700'
          : 'text-gray-500 hover:bg-gray-100 hover:text-blue-500 dark:text-gray-200 dark:hover:bg-gray-700'
      }
    `;

    return (
      <NoPrefetchLink {...linkProps}>
        <a className={className}>{item.name}</a>
      </NoPrefetchLink>
    );
  };

  return (
    <div className='custom-scrollbar overflow-y-auto'>
      <ul className='flex text-xs font-semibold'>
        {items.map((item) => {
          return (
            <li className='shrink-0 grow-0 basis-auto' key={item.key}>
              {renderLink(item)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
