import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoIosSearch } from 'react-icons/io';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { debounce } from '@/utils/util';

type DropdownList = {
  id: number;
  name: string;
};

/**
 * 顶部搜索输入框组件
 * @returns {JSX.Element}
 */
export default function SearchInput(): JSX.Element {
  const router = useRouter();
  const initialQuery = router.query?.q as string;
  const [query, setQuery] = useState<string>(initialQuery || '');
  // 联想词下拉列表
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownList, setDropdownList] = useState<DropdownList[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const clearQuery = () => setQuery('');

  const getLenovoWord = useCallback(
    debounce((query: string) => {
      fetcher(makeUrl('/search/suggest/', { q: query }))
        .then((res: any) => {
          if (res?.length > 0) {
            setDropdownList(res);
            setShowDropdown(true);
          }
        })
        .catch((err) => console.error(err));
    }, 100),
    []
  );

  const jumpToResultPage = (query: string) => {
    setShowDropdown(false);
    if (query) {
      router.push(`/search/result?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      jumpToResultPage(e.currentTarget.value);
    }
  };

  const handleSearchClick = () => {
    jumpToResultPage(query);
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(false);
    setDropdownList([]);
    const pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (value.length > 1 && !pattern.test(value)) {
      getLenovoWord(value);
    }
  };

  const handleLenovoWordClick = (keyword: string) => {
    setQuery(keyword);
    setShowDropdown(false);
    jumpToResultPage(keyword);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  const dropdownClassName = classNames(
    'absolute z-10 mt-1 w-full origin-top-right rounded-md border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-800 shadow-lg',
    {
      block: showDropdown,
      hidden: !showDropdown,
    }
  );

  return (
    <div
      ref={dropdownRef}
      className='inline-flex flex-auto items-stretch rounded-md bg-white px-2 dark:bg-transparent md:flex-none'
    >
      <div className='relative w-full max-w-xs 2xl:max-w-sm'>
        <input
          type='text'
          className='block h-10 w-full rounded-md border-gray-200 py-2 pl-2 pr-14 text-xs placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-400 dark:focus:border-blue-900 dark:focus:ring-blue-900 md:text-sm'
          placeholder='搜索开源项目'
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
        />
        <IoIosSearch
          size={18}
          onClick={handleSearchClick}
          className='absolute inset-y-0 right-0 top-3 grid w-10 cursor-pointer place-content-center text-gray-800 dark:text-gray-300'
        />
        {query && (
          <AiOutlineCloseCircle
            size={17}
            onClick={clearQuery}
            className='absolute inset-y-0 right-6 top-3 grid w-10 cursor-pointer place-content-center text-gray-800 dark:text-gray-300'
          />
        )}

        <div className={dropdownClassName} role='menu'>
          <div className='p-2'>
            {dropdownList.map((item) => (
              <a
                key={item.id}
                href='#'
                className='block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                role='menuitem'
                onClick={() => handleLenovoWordClick(item.name)}
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
