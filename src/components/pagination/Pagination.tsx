import { useEffect, useState } from 'react';

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
  PreviousText,
  NextText,
  total,
  current = 1,
  onPageChange,
  ...rest
}: PaginationProps) {
  const [page, setPage] = useState<number>(current);
  useEffect(() => {
    setPage(current);
  }, [current]);

  const handlePageChange = (page: number) => {
    if (current == page) {
      return;
    }
    if (page <= 0) {
      onPageChange?.(1);
    } else {
      onPageChange?.(page);
    }
  };

  const JumpBtnClass = (type: number) => {
    let className = '';
    if (type === -1) {
      className =
        current <= 1
          ? 'pointer-events-none text-gray-400 hidden'
          : 'pointer-events-auto hover:!text-blue-500 text-gray-600 dark:text-gray-400';
    } else {
      className =
        current >= total
          ? 'pointer-events-none text-gray-400 hidden'
          : 'pointer-events-auto hover:!text-blue-500 text-gray-600 dark:text-gray-400';
    }
    return clsxm(
      'inline-flex font-normal items-center gap-2 rounded-md p-2 cursor-pointer active:text-blue-500',
      className
    );
  };
  return (
    <div className={clsxm('', className)} {...rest}>
      <nav className='flex items-center justify-center space-x-2'>
        <div
          onClick={() => handlePageChange(page - 1)}
          className={JumpBtnClass(-1)}
        >
          <span aria-hidden='true'>«</span>
          <span>{PreviousText}</span>
        </div>

        <input
          type='number'
          className='text-xm block w-20 rounded-md border-gray-200 py-1 px-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700'
          min='1'
          max={total}
          value={page}
          onInput={(e: any) => {
            const value = e.target.value;
            if (value > total) {
              setPage(total);
            } else {
              setPage(value);
            }
          }}
          onBlur={() => {
            handlePageChange(page);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePageChange(page);
            }
          }}
        />
        <b>/</b>
        <span className='mx-0 inline-flex h-10 w-10 items-center rounded-full p-4 font-medium text-gray-500 dark:text-gray-400'>
          {total}
        </span>
        <div
          onClick={() => handlePageChange(page + 1)}
          className={JumpBtnClass(1)}
        >
          <span>{NextText}</span>
          <span aria-hidden='true'>»</span>
        </div>
      </nav>
    </div>
  );
}
