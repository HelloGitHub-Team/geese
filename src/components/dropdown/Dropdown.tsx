import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

export type option = {
  key: string | number;
  value: string;
};
type DropdownProps = {
  size?: 'small' | 'medium' | 'large' | '';
  border?: boolean;
  width?: number;
  initValue?: string;
  options: option[];
  trigger?: string;
  onChange: (opt: any) => void;
};

export default function Dropdown(props: DropdownProps) {
  const [activeOption, setActiveOption] = useState(props.options[0]?.value);
  const [show, setShow] = React.useState<boolean>(false);

  // 该状态是为了防止用户点击选项时因为出发按钮的 blur 事件而导致无法触发点击事件的问题。
  // PC：当鼠标 hover 到下拉框选项时更新状态。
  // Mobile：当手指触摸到下拉框选项时更新状态。
  const [isHover, setIsHover] = React.useState(false);
  const dropdownBtnRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(120);

  useEffect(() => {
    // 如果没有 initValue 则默认选中第一个
    const value = props.options.find(
      (opt) => opt.key == props.initValue
    )?.value;

    setActiveOption(value ? value : props.options[0]?.value);
  }, [props.options, props.initValue]);

  useEffect(() => {
    const width = dropdownBtnRef.current?.clientWidth || 120;
    setWidth(width);
  }, []);

  const onChange = (opt: option) => {
    setActiveOption(opt.value);
    props.onChange(opt);
    setShow(false);
    setIsHover(false);
  };

  const wrapClassName = () =>
    classNames(
      'inline-flex items-stretch rounded-md bg-white dark:border-gray-700 dark:bg-gray-800',
      {
        border: props.border === false ? false : true,
      }
    );

  const dropdownClassName = (show: boolean) =>
    classNames(
      'absolute right-0 z-10 mt-10 origin-top rounded-md border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg',
      {
        block: show,
        hidden: !show,
        border: props.border,
      }
    );

  const btnClassName = () => {
    return classNames(
      'flex items-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300',
      {
        'px-2 py-1 text-sm': props.size === 'small',
        'px-2 py-2 text-base': props.size === 'medium',
      }
    );
  };

  const onTrigger = (event: string): any => {
    const triggerMap: any = {
      focus: () => {
        if (props.trigger === 'hover') {
          return;
        }
        setShow(!show);
      },
      blur: () => {
        isHover || setShow(false);
      },
      mousemove: () => {
        if (props.trigger === 'hover') {
          setShow(true);
        }
      },
      mouseleave: () => {
        if (props.trigger === 'hover') {
          setShow(false);
        }
      },
    };
    return triggerMap[event];
  };

  return (
    <div ref={dropdownBtnRef} className={wrapClassName()}>
      <button
        style={{ width: props.width || 'auto' }}
        className={btnClassName()}
        onFocus={onTrigger('focus')}
        onBlur={onTrigger('blur')}
        onMouseMove={onTrigger('mousemove')}
        onMouseLeave={onTrigger('mouseleave')}
      >
        {activeOption}
        <IoMdArrowDropdown className='ml-1' />
      </button>

      <div className='relative'>
        <div
          style={{ width: width }}
          className={dropdownClassName(show)}
          role='menu'
          onMouseLeave={onTrigger('mouseleave')}
        >
          <div
            className='p-2'
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onTouchStart={() => setIsHover(true)}
          >
            {props.options?.map((opt: option) => (
              <a
                key={opt.key}
                className='block cursor-pointer rounded-lg px-1 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                onClick={() => onChange(opt)}
              >
                {opt.value}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
