import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as React from 'react';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { debounce } from '@/utils/util';

type DropdownList = {
  id: number;
  name: string;
};

/**
 * @顶部搜索输入框
 * @returns
 */
export default function SearchInput() {
  const router = useRouter();
  const q = router.query?.q as string;

  const [query, setQuery] = React.useState<string>('');
  const [show, setShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (q) {
      setQuery(q);
    }
  }, [q]);

  // 联想词下拉列表
  const [dropdownList, setDropdownList] = React.useState<DropdownList[]>([]);
  const dropdownRef = React.useRef<any>();

  // 获取联想关键词
  const getLenovoWord = debounce((query: string) => {
    if (!query) {
      setDropdownList([]);
      setShow(false);
      return;
    }
    fetcher(makeUrl(`/search/suggest`, { q: query }))
      .then((res: any) => {
        if (res?.length > 0) {
          setDropdownList(res);
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 200);

  // 跳转搜索结果页面
  const jump2Result = React.useCallback(
    (q: string) => {
      setShow(false);
      if (q) {
        router.push(`/search/result?q=${q}`);
      } else {
        router.push(`/`);
      }
    },
    [router]
  );

  // 回车搜索
  const onKeyDown = React.useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        jump2Result(e.target.value);
      }
    },
    [jump2Result]
  );

  // 点击搜索图标
  const onSearch = React.useCallback(() => {
    jump2Result(query);
  }, [jump2Result, query]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    getLenovoWord(q);
  };

  const onClickLenovoWord = React.useCallback(
    (item: any) => {
      setQuery(item.name);
      setShow(false);
      jump2Result(item.name);
    },
    [jump2Result]
  );

  const onInputBlur = () => {
    setTimeout(() => {
      setShow(false);
    }, 100);
  };

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
      className='inline-flex flex-auto items-stretch rounded-md bg-white px-2'
      ref={dropdownRef}
    >
      <div className='relative w-full max-w-xs'>
        <input
          type='text'
          className='block h-10 w-full rounded-md border-gray-200 py-3 px-2 text-xs focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 md:text-sm'
          placeholder='搜索开源项目'
          value={query}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onInputBlur}
        ></input>
        <svg
          width='24'
          height='24'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute right-1 top-2 mr-2 cursor-pointer'
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
