import * as React from 'react';

import clsxm from '@/lib/clsxm';

type PaginationProps = {
  current: number;
  PreviousText?: string;
  NextText?: string;
  total: number; // 总页码
  onPageChange: (page: number) => void;
} & React.ComponentPropsWithoutRef<'div'>;

export default function Pagination({
  className,
  PreviousText = '上一期',
  NextText = '下一期',
  total,
  current = 1,
  onPageChange,
  ...rest
}: PaginationProps) {
  const [page, setPage] = React.useState<number>(current);
  React.useEffect(() => {
    setPage(current);
  }, [current]);
  const handlePageChange = (page: number) => {
    console.log(page);
    onPageChange?.(page);
  };
  const JumpBtnClass = (type: number) => {
    let className = '';
    if (type === -1) {
      className =
        current <= 1
          ? 'pointer-events-none text-gray-400 hidden'
          : 'pointer-events-auto hover:text-blue-600 text-gray-600';
    } else {
      className =
        current >= total
          ? 'pointer-events-none text-gray-400 hidden'
          : 'pointer-events-auto hover:text-blue-600 text-gray-600';
    }
    return clsxm('inline-flex items-center gap-2 rounded-md p-2', className);
  };
  return (
    <div className={clsxm('', className)} {...rest}>
      <nav className='flex items-center justify-center space-x-2'>
        <a href={`/periodical/volume/${page - 1}`} className={JumpBtnClass(-1)}>
          <span aria-hidden='true'>«</span>
          <span>{PreviousText}</span>
        </a>

        <input
          type='number'
          className='dark:text-gray-400" text-xm block w-20 rounded-md border-gray-200 py-1 px-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800'
          min='1'
          max={total}
          value={page}
          onInput={(e: any) => {
            console.log(e.target.value);
            const value = e.target.value;
            if (value > total) {
              setPage(total);
            } else if (value < 1) {
              setPage(1);
            } else {
              setPage(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePageChange(page);
            }
          }}
        />
        <b>/</b>
        <span className='mx-0 inline-flex h-10 w-10 items-center rounded-full p-4 font-medium text-gray-500'>
          {total}
        </span>
        <a href={`/periodical/volume/${page + 1}`} className={JumpBtnClass(1)}>
          <span>{NextText}</span>
          <span aria-hidden='true'>»</span>
        </a>
      </nav>
    </div>
  );
}
