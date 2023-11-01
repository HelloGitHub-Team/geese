import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { VscChromeClose } from 'react-icons/vsc';

import clsxm from '@/lib/clsxm';

export interface Props {
  visible: boolean;
  lockScroll?: boolean;
  title?: string | React.ReactNode;
  hideClose?: boolean; // 是否隐藏右上角关闭按钮
  maskClosable?: boolean; // 是否允许点击蒙层关闭
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
}

const BasicDialog = (props: Props) => {
  const {
    visible,
    children,
    className,
    onClose,
    maskClosable = true,
    lockScroll = true,
    hideClose = false,
  } = props;
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    if (lockScroll) {
      const scrollBarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.overflow = visible ? 'hidden' : 'unset';
      document.body.style.paddingRight = visible
        ? `${scrollBarWidth}px`
        : 'unset';
      const header: HTMLDivElement | null =
        document.querySelector('div.hg-header');
      if (header) {
        header.style.paddingRight = visible ? `${scrollBarWidth}px` : 'unset';
      }
    }

    setStartAnimation(visible);
  }, [visible]);

  const Template = (
    <>
      <div
        className='fixed left-0 top-0 right-0 bottom-0 z-10 bg-black bg-opacity-60'
        onClick={() => {
          if (maskClosable) onClose?.();
        }}
      ></div>
      <div
        className={clsxm(
          className,
          'fixed left-0 top-0 right-0 bottom-0 z-10 m-auto h-fit scale-90 bg-white transition-transform dark:bg-gray-800',
          {
            'scale-100': startAnimation,
          }
        )}
      >
        {!hideClose && (
          <div className='relative text-center'>
            {props.title}
            <VscChromeClose
              size={20}
              onClick={onClose}
              className='absolute top-0 right-1 cursor-pointer text-gray-500'
            />
          </div>
        )}
        {children}
      </div>
    </>
  );

  // document 在服务端渲染时不存在，不过一般在服务端渲染时 visible 的值为 false
  // 所以这里不需要做特殊处理
  return visible ? createPortal(Template, document.body) : null;
};

export default BasicDialog;
