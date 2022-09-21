import { useRouter } from 'next/router';
import Image from 'rc-image';
import React, { useEffect, useMemo, useState } from 'react';

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
  options = [],
  onChange,
}: RankSearchBarProps) => {
  const router = useRouter();
  const [target, setTarget] = useState<string>();
  const [month, setMonth] = useState<string>();

  console.log('rank search bar');

  useEffect(() => {
    const { pathname, query } = router;
    setMonth(query.month as any as string);
    setTarget(pathname);
  }, [router]);

  const typeOptions = useMemo(() => {
    return options.length
      ? options
      : [
          { key: '/report/tiobe', value: '编程语言' },
          { key: '/report/netcraft', value: '服务器' },
          { key: '/report/db-engines', value: '数据库' },
        ];
  }, [options]);

  const monthOptions = useMemo(() => {
    return monthList?.map((m) => ({ key: m, value: `${m}月` }));
  }, [monthList]);

  return (
    <div className='mb-2 flex items-center justify-between rounded-lg border bg-gray-50 py-2 px-2 shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-800'>
      <div className='grid w-1/3 justify-items-start'>
        <Dropdown
          options={typeOptions}
          initValue={target}
          onChange={(opt) => onChange('target', opt.key)}
        />
      </div>
      <div className='grid w-1/3 justify-items-center'>
        <div className='flex items-center'>
          <div className='inline h-5 w-5'>
            <Image src={logo} alt={title}></Image>
          </div>
          <span className='ml-1 dark:text-gray-300'>{title}</span>
        </div>
      </div>
      <div className='grid w-1/3 justify-items-end'>
        <Dropdown
          initValue={month}
          options={monthOptions}
          onChange={(opt: any) => onChange('month', opt.key)}
        />
      </div>
    </div>
  );
};

export const Table = ({ columns, list }: TableProps) => {
  return (
    <div className='overflow-hidden rounded-lg border shadow dark:border-gray-700 dark:shadow-none'>
      <table className='w-min	min-w-full table-fixed divide-y-2 divide-gray-200 text-sm dark:divide-gray-700'>
        <thead>
          <tr>
            {columns?.map(({ key, title, width = 'auto' }: column) => (
              <th
                key={key}
                scope='col'
                style={{ width: width }}
                className='px-4 py-2 text-left text-sm font-medium uppercase text-gray-500 dark:text-gray-300 md:px-6 md:py-3'
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
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
                    className='truncate whitespace-nowrap bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300 md:px-6 md:py-4'
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
