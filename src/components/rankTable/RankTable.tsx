import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';

import { RankDataItem } from '@/types/rank';

type column = {
  key: string;
  title: string;
  width: number | string;
  percent?: boolean;
  render: (row: any, showPercent?: boolean, i18n_lang?: string) => any;
};

type TableProps = {
  columns: column[];
  list: RankDataItem[];
  i18n_lang: string;
};

export const getMonthName = (
  month: number,
  i18n_lang: string,
  options: { format?: 'short' | 'long'; forceEnglish?: boolean } = {}
) => {
  const { format = 'short', forceEnglish = false } = options;
  const date = new Date(2023, month - 1, 1);

  if (forceEnglish) {
    return i18n_lang === 'en'
      ? date.toLocaleString('en', { month: 'long' })
      : month;
  }

  return date.toLocaleString(i18n_lang, { month: format });
};

export const RankTable = ({ columns, list, i18n_lang }: TableProps) => {
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
                className='px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300 md:px-6 md:py-3'
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {list?.map((row: RankDataItem, index) => (
            <tr key={index}>
              {columns.map(({ key, render, percent }) => {
                let content = row[key];
                if (render) {
                  content = render(row, percent, i18n_lang);
                }
                return (
                  <td
                    key={key}
                    className='truncate whitespace-nowrap bg-white px-4 py-2 text-left text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300 md:px-6 md:py-4'
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

type RankSearchBarProps = {
  title: string;
  logo: string;
  options?: any[];
  monthList: number[];
  i18n_lang: string;
  onChange: (key: string, value: string) => void;
};

export const RankSearchBar = ({
  title,
  logo,
  monthList = [],
  options = [],
  i18n_lang,
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

  const typeOptions = useMemo(() => {
    if (options.length) {
      return options;
    } else {
      return i18n_lang == 'en'
        ? [
            { key: '/report/tiobe', value: 'Language' },
            { key: '/report/contribution', value: 'Contribution' },
            { key: '/report/netcraft', value: 'Server' },
            { key: '/report/db-engines', value: 'Database' },
          ]
        : [
            { key: '/report/tiobe', value: '编程语言' },
            { key: '/report/contribution', value: '用户贡献' },
            { key: '/report/netcraft', value: '服务器' },
            { key: '/report/db-engines', value: '数据库' },
          ];
    }
  }, [options, i18n_lang]);

  const monthOptions = useMemo(() => {
    return monthList?.map((m) => ({
      key: m,
      value: getMonthName(m, i18n_lang) as string,
    }));
  }, [monthList, i18n_lang]);

  return (
    <div className='mb-2 flex items-center justify-between rounded-lg border bg-gray-50 py-2 px-2 shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-800'>
      <div className='justify-items-start'>
        <Dropdown
          options={typeOptions}
          initValue={target}
          size='small'
          onChange={(opt) => onChange('target', opt.key)}
        />
      </div>
      <div className=' justify-items-center'>
        <div className='flex items-center'>
          <div className='inline'>
            <img className='h-5 w-5' src={logo} alt='rank_logo' />
          </div>
          <span className='ml-1 hidden dark:text-gray-300 md:block'>
            {title}
          </span>
        </div>
      </div>
      <div className='justify-items-end'>
        <Dropdown
          initValue={month}
          size='small'
          options={monthOptions}
          onChange={(opt: any) => onChange('month', opt.key)}
        />
      </div>
    </div>
  );
};
