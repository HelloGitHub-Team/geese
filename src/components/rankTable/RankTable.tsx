import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';

import { RankDataItem } from '@/types/rank';

type column = {
  key: string;
  title: React.ReactNode;
  width: number | string;
  percent?: boolean;
  render: (row: any, showPercent?: boolean, i18n_lang?: string) => any;
};

type TableProps = {
  columns: column[];
  list: RankDataItem[];
  i18n_lang: string;
  minWidth?: number;
  compact?: boolean;
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

export const RankTable = ({
  columns,
  list,
  i18n_lang,
  minWidth,
  compact,
}: TableProps) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-700 ${compact ? 'overflow-x-auto' : 'overflow-hidden'}`}
    >
      <table
        className='w-full min-w-full table-fixed divide-y divide-gray-200 text-sm dark:divide-gray-700'
        style={minWidth ? { minWidth: `max(100%, ${minWidth}px)` } : undefined}
      >
        <thead>
          <tr>
            {columns?.map(({ key, title, width = 'auto' }: column) => (
              <th
                key={key}
                scope='col'
                style={{ width: width }}
                className={`bg-gray-50/80 px-2 py-3.5 text-xs font-medium text-gray-500 dark:bg-gray-900/30 dark:text-gray-400 ${key === 'position' ? 'text-center' : 'text-left'}`}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className='divide-y divide-gray-100 dark:divide-gray-700/60'>
          {list?.map((row: RankDataItem, index) => (
            <tr
              key={index}
              className='group bg-white transition-colors hover:bg-gray-50/80 dark:bg-gray-800 dark:hover:bg-gray-700/30'
            >
              {columns.map(({ key, render, percent }) => {
                let content = row[key as keyof RankDataItem];
                if (render) {
                  content = render(row, percent, i18n_lang);
                }
                return (
                  <td
                    key={key}
                    title={!compact && key === 'name' ? row.name : undefined}
                    className={`px-2 py-3 align-middle text-[13px] font-normal tabular-nums text-gray-800 dark:text-gray-300 ${
                      key === 'position'
                        ? 'text-center [&>div]:justify-center'
                        : 'text-left'
                    } ${compact ? 'whitespace-nowrap' : key === 'name' ? 'truncate md:whitespace-normal md:break-words' : 'whitespace-normal break-words'}`}
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
            { key: '/report/lm-rank', value: 'Model' },
            { key: '/report/tiobe', value: 'Language' },
            { key: '/report/contribution', value: 'Contribution' },
            { key: '/report/db-engines', value: 'Database' },
          ]
        : [
            { key: '/report/lm-rank', value: '大模型' },
            { key: '/report/tiobe', value: '编程语言' },
            { key: '/report/contribution', value: '用户贡献' },
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
    <div className='mb-2 flex items-center rounded-lg border bg-gray-50 px-2 py-2 shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-800'>
      <div className='flex flex-1 justify-start'>
        <Dropdown
          options={typeOptions}
          initValue={target}
          size='small'
          onChange={(opt) => onChange('target', opt.key)}
        />
      </div>
      <div className='flex justify-center'>
        <div className='flex items-center'>
          <div className='inline'>
            <img
              className={`h-5 w-5 cursor-pointer hover:animate-spin ${
                title === 'HelloGitHub' || title === 'Arena'
                  ? 'dark:invert'
                  : ''
              }`}
              src={logo}
              alt={title}
            />
          </div>
          <span
            className={`ml-1 dark:text-gray-300 ${
              title === 'Arena' ? '' : 'hidden md:block'
            }`}
          >
            {title}
          </span>
        </div>
      </div>
      <div className='flex flex-1 justify-end'>
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
