import { ReactNode, useState } from 'react';
import { useEffect } from 'react';

import clsxm from '@/lib/clsxm';

export interface Props {
  visible: boolean;
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
}

const BasicDialog = (props: Props) => {
  const { visible, children, className, onClose } = props;
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setStartAnimation(visible);
  }, [visible]);

  return visible ? (
    <>
      <div
        className='fixed left-0 top-0 right-0 bottom-0 z-10 bg-black bg-opacity-60'
        onClick={onClose}
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
        {children}
      </div>
    </>
  ) : null;
};

export default BasicDialog;
