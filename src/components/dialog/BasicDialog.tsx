import { ReactNode, useState } from 'react';
import { useEffect } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

import clsxm from '@/lib/clsxm';

export interface Props {
  visible: boolean;
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
    hideClose = false,
  } = props;
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setStartAnimation(visible);
  }, [visible]);

  return visible ? (
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
  ) : null;
};

export default BasicDialog;
