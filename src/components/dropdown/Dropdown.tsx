import classNames from 'classnames';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { IoChevronDown } from 'react-icons/io5';

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
  align?: 'left' | 'right';
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
      'relative inline-flex max-w-full items-stretch rounded-lg border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800',
      {
        border: !!border,
      }
    );

  const dropdownClassName = (show: boolean) =>
    classNames(
      'absolute top-full z-20 mt-1.5 min-w-[8rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800',
      {
        block: show,
        hidden: !show,
        'left-0': props.align === 'left',
        'right-0': props.align !== 'left',
      }
    );

  const btnClassName = () => {
    return classNames(
      'flex min-w-0 items-center gap-2 rounded-lg text-left text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-gray-200 dark:hover:bg-gray-700',
      props.size === 'small'
        ? 'px-2.5 py-1.5 text-xs leading-5'
        : props.size === 'large'
          ? 'px-3.5 py-2.5 text-base'
          : 'px-3 py-2 text-sm',
      show && 'bg-gray-50 dark:bg-gray-700'
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
        type='button'
        aria-haspopup='menu'
        aria-expanded={show}
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
        <span className='truncate' title={activeOption?.value}>
          {activeOption?.value}
        </span>
        <IoChevronDown
          aria-hidden='true'
          className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${show ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        style={{ width }}
        className={dropdownClassName(show)}
        role='menu'
        onMouseLeave={onTrigger('mouseleave')}
      >
        <div
          className='hidden-scrollbar max-h-64 overflow-y-auto p-1'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onTouchStart={() => setIsHover(true)}
        >
          {props.options?.map((opt: option) => (
            <span
              key={opt.key}
              role='menuitemradio'
              aria-checked={activeOption?.key === opt.key}
              className={classNames(
                'block cursor-pointer whitespace-normal break-words rounded-md px-2.5 py-1.5 text-left text-sm leading-5 transition-colors',
                activeOption?.key === opt.key
                  ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
              )}
              onClick={() => onChange(opt)}
            >
              {opt.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Dropdown);
