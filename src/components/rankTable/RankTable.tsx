import { useRouter } from 'next/router';
import Image from 'rc-image';
import React, { useEffect, useState } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';

type column = {
  key: string;
  title: string;
};
type listItem = {
  [key: string]: string;
};
type RankTableProps = {
  columns: column[];
  list: listItem[];
};

export default function RankTable({ columns = [], list = [] }: RankTableProps) {
  return (
    <div className='flex flex-col'>
      <div className='-m-1.5 overflow-x-auto'>
        <div className='inline-block min-w-full p-1.5 align-middle'>
          <div className='overflow-hidden rounded-lg border shadow dark:border-gray-700 dark:shadow-gray-900'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  {columns?.map(({ key, title }) => (
                    <th
                      key={key}
                      scope='col'
                      className='text-xm px-6 py-3 text-left font-medium uppercase text-gray-500 dark:text-gray-400'
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-white-200 dark:divide-white-700 divide-y'>
                {list?.map((row: listItem, index) => (
                  <tr key={index}>
                    {columns.map(({ key, render }) => {
                      let content = row[key];
                      if (render) {
                        content = render(row, index);
                      }
                      return (
                        <td
                          key={key}
                          className='whitespace-nowrap bg-white px-6 py-4 text-left text-sm font-medium text-gray-800 dark:text-gray-200'
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

type RankSearchBarProps = {
  options: any[];
  title: string;
  month_list: number[];
  onChange: (key: string, value: string) => void;
};

export const RankSearchBar = ({
  title,
  logo,
  monthList = [],
  options = [
    { key: '/report/tiobe', value: '编程语言' },
    { key: '/report/netcraft', value: '服务器' },
    { key: '/report/db-engines', value: '数据库' },
  ],
  onChange,
}: RankSearchBarProps) => {
  const router = useRouter();
  const [target, setTarget] = useState();
  const [month, setMonth] = useState();

  useEffect(() => {
    const { pathname, query } = router;
    setMonth(query.month);
    setTarget(pathname);
  }, [router]);

  return (
    <div className='mb-2 flex items-center justify-between overflow-hidden rounded-lg border bg-gray-50 py-2 px-2 shadow dark:border-gray-700 dark:bg-gray-700 dark:shadow-gray-900'>
      <Dropdown
        options={options}
        initValue={target}
        onChange={(opt) => onChange('target', opt.key)}
      />
      <div className='flex items-center'>
        {logo && (
          <Image className='inline h-6 w-6' src={logo} alt={title}></Image>
        )}
        <span className='ml-1'>{title}</span>
        {/* <Tooltip /> */}
      </div>
      <div>
        <Dropdown
          initValue={month}
          options={monthList?.map((m) => ({ key: m, value: `${m}月` }))}
          onChange={(opt) => onChange('month', opt.key)}
        />
      </div>
    </div>
  );
};

export const Tooltip = () => {
  return (
    <div className='hs-tooltip inline-block'>
      <button
        type='button'
        className='hs-tooltip-toggle inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-white/[.1] dark:hover:bg-white/[.05] dark:hover:text-white'
      >
        tip
        <span
          className='hs-tooltip-content invisible absolute z-10 inline-block rounded-md bg-gray-900 py-1 px-2 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100 dark:bg-slate-700'
          role='tooltip'
        >
          Tooltip on top
        </span>
      </button>
    </div>
  );
};
