import * as React from 'react';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';

import Dropdown from './Dropdown';

/**
 * @搜索组件
 * @returns
 */
export default function SearchInput() {
  const [query, setQuery] = React.useState<string>('');

  const getData = React.useCallback((query) => {
    fetcher(makeUrl(`/`, { q: query, page: 1 }))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onKeyDown = React.useCallback(
    (e) => {
      if (e.key === 'Enter') {
        console.log('onKeyDown', e, e.target.value);
        getData(e.target.value);
      }
    },
    [getData]
  );

  const onChange = React.useCallback((e) => {
    console.log('onChange', e.target.value);
    setQuery(e.target.value);
  }, []);

  // React.useEffect(() => {
  //   fetcher(makeUrl(`/`, { q: query, page: 1 }))
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [query]);

  const dropDownList = [
    { key: '1', title: 'Vue' },
    { key: '2', title: 'React' },
    { key: '3', title: 'Angular' },
  ];

  return (
    <div>
      <input
        type='text'
        className='block w-full rounded-md border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
        placeholder='探索 HelloGitHub'
        value={query}
        onChange={(e) => onChange(e)}
        onKeyDown={(e) => onKeyDown(e)}
      />
      <Dropdown list={dropDownList}></Dropdown>
    </div>
  );
}
