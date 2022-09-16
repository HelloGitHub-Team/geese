import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';

type option = {
  key: string | number;
  value: string;
};
type DropdownProps = {
  initValue?: string;
  options: option[];
  trigger?: string;
  onChange: (opt: any) => void;
};

export default function Dropdown(props: DropdownProps) {
  const [activeOption, setActiveOption] = useState(props.options[0]?.value);
  const [show, setShow] = React.useState<boolean>(false);
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
    console.log({ dropdownBtnRef });
    const width = dropdownBtnRef.current?.clientWidth || 120;
    console.log({ width });
    setWidth(width);
  }, []);

  const onChange = (opt: option) => {
    setActiveOption(opt.value);
    props.onChange(opt);
  };

  const dropdownClassName = (show: boolean) =>
    classNames(
      'absolute right-0 z-10 mt-10 origin-top rounded-md border border-gray-100 bg-white shadow-lg',
      {
        block: show,
        hidden: !show,
      }
    );

  const onTrigger = (event: string): any => {
    const triggerMap: any = {
      focus: () => {
        if (props.trigger === 'hover') {
          return;
        }
        setShow(!show);
      },
      blur: () => {
        setTimeout(() => setShow(false), 100);
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
    <div
      ref={dropdownBtnRef}
      className='inline-flex items-stretch rounded-md border bg-white'
    >
      <button
        className='flex items-center rounded-l-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700'
        onFocus={onTrigger('focus')}
        onBlur={onTrigger('blur')}
        onMouseMove={onTrigger('mousemove')}
        onMouseLeave={onTrigger('mouseleave')}
      >
        {activeOption}
        <AiOutlineDown className='ml-2' />
      </button>

      <div className='relative'>
        <div
          style={{ width: width }}
          className={dropdownClassName(show)}
          role='menu'
          onMouseLeave={onTrigger('mouseleave')}
        >
          <div className='p-2'>
            {props.options?.map((opt: option) => (
              <a
                key={opt.key}
                className='block cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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
