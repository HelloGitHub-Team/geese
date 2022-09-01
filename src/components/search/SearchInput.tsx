import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as React from 'react';
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

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          className='block h-10 w-full rounded-md border-gray-200 py-3 px-2 text-xs focus:border-blue-500 focus:ring-blue-500 md:text-sm'
          placeholder='搜索开源项目'
          value={query}
          onChange={onQueryChange}
          onKeyDown={onKeyDown}
          onBlur={onInputBlur}
        ></input>

        <IoIosSearch
          size={24}
          className='absolute right-1 top-2 mr-2 cursor-pointer'
          onClick={onSearch}
        />

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
