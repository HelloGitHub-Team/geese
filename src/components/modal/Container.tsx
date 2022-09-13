import { ReactNode, useState } from 'react';
import { useEffect } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';

export interface Props {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}

const Container = (props: Props) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setStartAnimation(true);
  }, []);

  return (
    <>
      <div
        className='fixed left-0 top-0 right-0 bottom-0 z-10 bg-black bg-opacity-60'
        onClick={props.onCancel}
      ></div>
      {/* PC 端 */}
      <div
        className={clsxm(
          'fixed left-0 top-0 right-0 bottom-0 z-10 m-auto hidden h-fit w-96 scale-90 rounded bg-white transition-transform sm:block',
          {
            'scale-125': startAnimation,
          }
        )}
      >
        <div className='m-4 text-base font-semibold'>
          {props.title}
          <div
            className='float-right -m-3 cursor-pointer p-3 text-gray-400'
            onClick={props.onCancel}
          >
            <VscChromeClose size={18} />
          </div>
        </div>
        <div className='m-4 text-sm'>{props.children || props.content}</div>
        <div className='flex justify-end gap-2 py-2 px-3'>
          <Button
            className='py-1 px-2 font-normal text-gray-600'
            variant='light'
            onClick={props.onCancel}
          >
            {props.cancelText || '取消'}
          </Button>
          <Button className='py-1 px-2 font-normal' onClick={props.onOk}>
            {props.okText || '确认'}
          </Button>
        </div>
      </div>
      {/* 移动端 */}
      <div
        className={clsxm(
          'fixed left-0 top-0 right-0 bottom-0 z-10 m-auto h-fit w-80 scale-75 overflow-hidden rounded-lg bg-white transition-transform sm:hidden',
          {
            'scale-100': startAnimation,
          }
        )}
      >
        <div className='pt-6 text-center text-base text-gray-800'>
          {props.title}
        </div>
        <div className='px-6 pt-2 pb-6 text-center text-sm text-gray-500'>
          {props.children || props.content}
        </div>
        <div className='flex gap-px bg-gray-100 pt-px'>
          <Button
            className='flex h-12 flex-1 items-center justify-center rounded-none bg-white font-normal text-gray-800'
            variant='ghost'
            onClick={props.onCancel}
          >
            {props.cancelText || '取消'}
          </Button>
          <Button
            className='flex h-12 flex-1 items-center justify-center rounded-none bg-white font-normal text-blue-500'
            variant='ghost'
            onClick={props.onOk}
          >
            {props.okText || '确认'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Container;
