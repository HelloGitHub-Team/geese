import { useRouter } from 'next/router';
import Image from 'rc-image';
import React, { useEffect, useState } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';

import { RankDataItem } from '@/types/rank';

type column = {
  key: string;
  title: string;
  width: number | string;
  render: (row: any, index: number) => any;
};

type TableProps = {
  columns: column[];
  list: RankDataItem[];
};

export default function RankTable({ columns = [], list = [] }: TableProps) {
  return <Table columns={columns} list={list} />;
}

type RankSearchBarProps = {
  title: string;
  logo: string;
  options?: any[];
  monthList: number[];
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
  const [target, setTarget] = useState<string>();
  const [month, setMonth] = useState<string>();

  useEffect(() => {
    const { pathname, query } = router;
    setMonth(query.month as any as string);
    setTarget(pathname);
  }, [router]);

  return (
    <div className='mb-2 flex items-center justify-between rounded-lg border bg-gray-50 py-2 px-2 shadow dark:border-gray-700 dark:bg-gray-700 dark:shadow-gray-900'>
      <Dropdown
        options={options}
        initValue={target}
        onChange={(opt) => onChange('target', opt.key)}
      />
      <div className='flex items-center'>
        {logo && (
          <div className='inline h-6 w-6'>
            <Image className='inline h-6 w-6' src={logo} alt={title}></Image>
          </div>
        )}
        <span className='ml-1'>{title}</span>
      </div>
      <Dropdown
        initValue={month}
        options={monthList?.map((m) => ({ key: m, value: `${m}月` }))}
        onChange={(opt: any) => onChange('month', opt.key)}
      />
    </div>
  );
};

export const Table = ({ columns, list }: TableProps) => {
  return (
    <div className='overflow-x-auto rounded-lg border shadow'>
      <table className='min-w-full divide-y-2 divide-gray-200 text-sm'>
        <thead>
          <tr>
            {columns?.map(({ key, title, width = 'auto' }: column) => (
              <th
                key={key}
                scope='col'
                style={{ minWidth: width }}
                className='text-xm px-6 py-3 text-left font-medium uppercase text-gray-500 dark:text-gray-400'
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className='divide-y divide-gray-200'>
          {list?.map((row: RankDataItem, index) => (
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
  );
};
