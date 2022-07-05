import * as React from 'react';

type DropdownProps = {
  list: string[];
  children: React.ReactElement;
} & React.ComponentPropsWithoutRef<'div'>;

export default function Dropdown({ list = [], children }: DropdownProps) {
  const dropdownRef = React.useRef();
  const onOpenDropdown = () => {
    console.log('open');
  };
  return (
    <div className='hs-dropdown relative inline-flex'>
      <button
        id='hs-dropdown-default'
        type='button'
        onClick={onOpenDropdown}
        ref={dropdownRef}
        className='hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-md border bg-white py-3 px-4 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800'
      >
        Actions
      </button>

      <div
        className='hs-dropdown-menu duration hs-dropdown-open:opacity-100 z-10 mt-2 hidden w-72 min-w-[15rem] rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800'
        aria-labelledby='hs-dropdown-default'
      >
        {list.map((li) => (
          <a
            className='flex items-center gap-x-3.5 rounded-md py-2 px-3 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            href='#'
            key={li.key}
          >
            {li.title}
          </a>
        ))}
      </div>
    </div>
  );
}
