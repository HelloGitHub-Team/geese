import classNames from 'classnames';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

export type option = {
  key: string | number;
  value: string;
};
type DropdownProps = {
  size?: 'small' | 'medium' | 'large' | '';
  border?: boolean;
  width?: number;
  minWidth?: number;
  initValue?: string;
  options: option[];
  trigger?: string;
  onChange?: (opt: any) => void;
};

function Dropdown(props: DropdownProps, ref: any) {
  const [activeOption, setActiveOption] = useState<option>();
  const [show, setShow] = React.useState<boolean>(false);

  // 该状态是为了防止用户点击选项时因为出发按钮的 blur 事件而导致无法触发点击事件的问题。
  // PC：当鼠标 hover 到下拉框选项时更新状态。
  // Mobile：当手指触摸到下拉框选项时更新状态。
  const [isHover, setIsHover] = React.useState(false);
  const dropdownBtnRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(120);

  useImperativeHandle(ref, () => {
    return {
      activeOption,
    };
  });

  useEffect(() => {
    // 如果没有 initValue 则默认选中第一个
    const option =
      props.options.find((opt) => opt.key == props.initValue) ||
      props.options[0] ||
      {};

    setActiveOption(option);
  }, [props.options, props.initValue]);

  const setDropdownWidth = useCallback(() => {
    const { offsetWidth, clientWidth } = dropdownBtnRef.current || {};
    const nWidth = offsetWidth || clientWidth || 120;
    if (nWidth !== width) {
      setWidth(nWidth);
    }
  }, [dropdownBtnRef, width]);

  useEffect(() => {
    setDropdownWidth();
  }, [setDropdownWidth]);

  const onChange = (opt: option) => {
    setActiveOption(opt);
    props.onChange?.(opt);
    setShow(false);
    setIsHover(false);
  };

  const wrapClassName = (border = true) =>
    classNames(
      'inline-flex items-stretch rounded-md bg-white dark:border-gray-700 dark:bg-gray-800',
      {
        border: !!border,
      }
    );

  const dropdownClassName = (show: boolean) =>
    classNames(
      'absolute right-0 z-10 mt-10 origin-top rounded-md border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg',
      {
        block: show,
        hidden: !show,
        'border top-1': props.border,
      }
    );

  const btnClassName = () => {
    return classNames(
      'flex items-center rounded-md px-2 py-1 sm:py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
    );
  };

  const onTrigger = (event: string): any => {
    const triggerMap: any = {
      focus: () => {
        if (props.trigger === 'hover') {
          return;
        }
        if (!show) {
          setDropdownWidth();
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
    <div ref={dropdownBtnRef} className={wrapClassName(props.border)}>
      <button
        style={{
          width: props.width || '100%',
          minWidth: props.minWidth || '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        className={btnClassName()}
        onClick={onTrigger('focus')}
        onBlur={onTrigger('blur')}
        onMouseMove={onTrigger('mousemove')}
        onMouseLeave={onTrigger('mouseleave')}
      >
        <span className='truncate'>{activeOption?.value}</span>
        <IoMdArrowDropdown className='ml-1' />
      </button>

      <div className='relative'>
        <div
          style={{ width }}
          className={dropdownClassName(show)}
          role='menu'
          onMouseLeave={onTrigger('mouseleave')}
        >
          <div
            className='hidden-scrollbar max-h-64 overflow-y-auto p-2'
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onTouchStart={() => setIsHover(true)}
          >
            {props.options?.map((opt: option) => (
              <a
                key={opt.key}
                className='block cursor-pointer truncate rounded-lg px-1 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
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

export default forwardRef(Dropdown);
