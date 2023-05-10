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
 * @顶部搜索输入框
 * @returns
 */
export default function SearchInput() {
  const router = useRouter();
  const q = router.query?.q as string;

  const [query, setQuery] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (q) {
      setQuery(q);
    }
  }, [q]);

  const clearQuery = () => setQuery('');

  // 联想词下拉列表
  const [dropdownList, setDropdownList] = useState<DropdownList[]>([]);
  const dropdownRef = useRef<any>();

  // 获取联想关键词
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getLenovoWord = useCallback(
    debounce((query: string) => {
      fetcher(makeUrl(`/search/suggest/`, { q: query }))
        .then((res: any) => {
          if (res?.length > 0) {
            setDropdownList(res);
            setShow(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100),
    []
  );

  // 跳转搜索结果页面
  const jump2Result = (q: string) => {
    setShow(false);
    if (q) {
      router.push(`/search/result?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/`);
    }
  };

  // 回车搜索
  const onKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      jump2Result(e.target.value);
    }
  };

  // 点击搜索图标
  const onSearch = () => {
    jump2Result(query);
  };

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setShow(false);
    setDropdownList([]);
    const patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (q.length > 1 && patrn.exec(q) == null) {
      getLenovoWord(q);
    }
  };

  const onClickLenovoWord = (keyword: string) => {
    setQuery(keyword);
    setShow(false);
    jump2Result(keyword);
  };

  const onInputBlur = () => {
    setTimeout(() => {
      setShow(false);
    }, 150);
  };

  const dropdownClassName = (show: boolean) =>
    classNames(
      'absolute z-10 mt-1 w-full origin-top-right rounded-md border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-800 shadow-lg',
      {
        block: show,
        hidden: !show,
      }
    );

  return (
    <div
      className='inline-flex flex-auto items-stretch rounded-md bg-white px-2 dark:bg-transparent md:flex-none'
      ref={dropdownRef}
    >
      <div className='relative w-full max-w-xs 2xl:max-w-sm'>
        <input
          type='text'
          className='block h-10 w-full rounded-md border-gray-200 py-2 pl-2 pr-14 text-xs placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-400 dark:focus:border-blue-900 dark:focus:ring-blue-900 md:text-sm'
          placeholder='搜索开源项目'
          value={query}
          onChange={onQueryChange}
          onKeyDown={onKeyDown}
          onBlur={onInputBlur}
        ></input>
        <IoIosSearch
          size={18}
          onClick={onSearch}
          className='absolute inset-y-0 right-0 top-3 grid w-10 cursor-pointer place-content-center text-gray-800 dark:text-gray-300'
        />
        {query ? (
          <AiOutlineCloseCircle
            size={17}
            onClick={clearQuery}
            className='absolute inset-y-0 right-6 top-3 grid w-10 cursor-pointer place-content-center text-gray-800 dark:text-gray-300'
          />
        ) : (
          <></>
        )}

        <div className={dropdownClassName(show)} role='menu'>
          <div className='p-2'>
            {dropdownList.map((item) => (
              <a
                href='#'
                className='block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                role='menuitem'
                key={item.id}
                onClick={() => onClickLenovoWord(item.name)}
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
