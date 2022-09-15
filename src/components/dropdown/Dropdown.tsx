import React, { useEffect, useState } from 'react';

type option = {
  key: string | number;
  value: string;
};
type DropdownProps = {
  initValue?: string;
  options: option[];
  onChange: (opt: any) => void;
};
export default function Dropdown(props: DropdownProps) {
  const [activeOption, setActiveOption] = useState(props.options[0]?.value);
  useEffect(() => {
    // 如果没有 initValue 则默认选中第一个
    const value = props.options.find(
      (opt) => opt.key == props.initValue
    )?.value;

    setActiveOption(value ? value : props.options[0]?.value);
  }, [props.options, props.initValue]);
  const onChange = (opt: option) => {
    setActiveOption(opt.value);
    props.onChange(opt);
  };
  return (
    <div className='hs-dropdown relative inline-flex [--trigger:hover]'>
      <button
        id='hs-dropdown-hover-event'
        type='button'
        className='hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-md border bg-white py-1 px-3 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800'
      >
        {activeOption}
        <svg
          className='h-2.5 w-2.5 text-gray-600 hs-dropdown-open:rotate-180'
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </button>

      <div
        className='hs-dropdown-menu duration mt-2 hidden rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] before:absolute before:-top-4 before:left-0 before:h-4 before:w-full after:absolute after:-bottom-4 after:left-0 after:h-4 after:w-full hs-dropdown-open:opacity-100 dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800'
        aria-labelledby='hs-dropdown-hover-event'
      >
        {props.options?.map((opt: option) => (
          <a
            key={opt.key}
            className='flex cursor-pointer items-center gap-x-3.5 rounded-md py-2 px-3 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            onClick={() => onChange(opt)}
          >
            {opt.value}
          </a>
        ))}
      </div>
    </div>
  );
}
