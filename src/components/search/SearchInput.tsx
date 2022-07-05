import classNames from 'classnames';
import * as React from 'react';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';
import { debounce } from '@/utils/util';

type DropdownList = {
  id: number;
  name: string;
};

/**
 * @搜索组件
 * @returns
 */
export default function SearchInput() {
  const [query, setQuery] = React.useState<string>('');
  const [show, setShow] = React.useState<boolean>(false);

  const [dropdownList, setDropdownList] = React.useState<DropdownList[]>([
    { id: 1, name: 'Vue' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Angular' },
  ]);
  const dropdownRef = React.useRef();

  // 获取搜索结果
  const getSearchItems = React.useCallback((query) => {
    fetcher(makeUrl(`/search`, { q: query, page: 1 }))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 获取联想关键词
  const getLenovoWord = React.useCallback(
    debounce((query) => {
      console.log('开始获取联想关键词', query);
      fetcher(makeUrl(`/search/suggest`, { q: query }))
        .then((res) => {
          console.log(res);
          setDropdownList(res);
          if (res.length > 0) {
            setShow(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000),
    []
  );

  const onKeyDown = React.useCallback(
    (e) => {
      if (e.key === 'Enter') {
        console.log('onKeyDown', e, e.target.value);
        getSearchItems(e.target.value);
      }
    },
    [getSearchItems]
  );

  const onSearch = React.useCallback(() => {
    getSearchItems(query);
  }, [getSearchItems, query]);

  const onChange = (e) => {
    console.log('onChange', e.target.value);
    setQuery(e.target.value);
    getLenovoWord(e.target.value);
  };

  const onClickLenovoWord = React.useCallback(
    (item) => {
      console.log('onClickLenovoWord', item.name);
      setShow(false);
      setQuery(item.name);
      getSearchItems(item.name);
    },
    [getSearchItems]
  );

  const dropdownClassName = (show: boolean) =>
    classNames(
      'absolute z-10 mt-1 w-full origin-top-right rounded-md border border-gray-100 bg-white shadow-lg',
      {
        block: show,
        hidden: !show,
      }
    );

  return (
    <div
      className='inline-flex flex-auto items-stretch rounded-md bg-white pl-5'
      ref={dropdownRef}
    >
      <div className='relative w-2/4'>
        <input
          type='text'
          className='block w-full rounded-md border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
          placeholder='探索 HelloGitHub'
          value={query}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setShow(true)}
        ></input>
        <svg
          width='24'
          height='24'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute right-1 top-0 mt-3 mr-3 cursor-pointer'
          onClick={onSearch}
        >
          <rect width='48' height='48' fill='white' fillOpacity='0.01' />
          <path
            d='M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z'
            fill='none'
            stroke='#333'
            strokeWidth='4'
            strokeLinejoin='round'
          />
          <path
            d='M26.6568 14.3431C25.2091 12.8954 23.2091 12 21 12C18.7909 12 16.7909 12.8954 15.3431 14.3431'
            stroke='#333'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M33.2218 33.2218L41.7071 41.7071'
            stroke='#333'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

        <div className={dropdownClassName(show)} role='menu'>
          <div className='p-2'>
            {dropdownList.map((item) => (
              <a
                href='#'
                className='block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                role='menuitem'
                key={item.id}
                onClick={() => onClickLenovoWord(item)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
