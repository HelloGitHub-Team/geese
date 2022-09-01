import classNames from 'classnames';
import React, { ReactNode } from 'react';
import {
  IoIosInformationCircleOutline,
  IoMdCheckmarkCircleOutline,
  IoMdClose,
  IoMdCloseCircleOutline,
} from 'react-icons/io';

interface MessageProps {
  type: string;
  content: string;
  onClose: () => void;
}

function Message(props: MessageProps) {
  const { type, content, onClose } = props;
  const wrapClassName = (type: string) =>
    classNames(
      'inline-block rounded border border-green-900/10 bg-green-50 p-4 text-green-700',
      {
        'text-green-700 border-green-900/10 bg-green-50': type === 'success',
        'text-amber-700 border-amber-900/10 bg-amber-50': type === 'warning',
        'text-red-700 border-red-900/10 bg-red-50': type === 'error',
        'text-sky-700 border-sky-900/10 bg-sky-50': type === 'info',
      }
    );

  const icon = (type = 'success'): ReactNode => {
    const iconMap = {
      success: (
        <span className='op rounded-full bg-green-600 p-2 text-white'>
          <IoMdCheckmarkCircleOutline className='h-5 w-5' />
        </span>
      ),
      warning: (
        <span className='rounded-full bg-amber-600 p-2 text-white'>
          <IoIosInformationCircleOutline className='h-5 w-5' />
        </span>
      ),
      error: (
        <span className='rounded-full bg-red-600 p-2 text-white'>
          <IoMdCloseCircleOutline className='h-5 w-5' />
        </span>
      ),
      info: (
        <span className='rounded-full bg-sky-600 p-2 text-white'>
          <IoIosInformationCircleOutline className='h-5 w-5' />
        </span>
      ),
    };
    return iconMap[type as keyof typeof iconMap];
  };

  return (
    <div className={wrapClassName(type)} role='alert'>
      <div className='pointer-events-auto flex'>
        <div className='mr-5 flex items-center gap-4'>
          {icon(type)}
          <span className='block text-base opacity-90'>{content}</span>
        </div>

        <button className='opacity-90' type='button' onClick={onClose}>
          <span className='sr-only'> Close </span>
          <IoMdClose className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}

export default Message;
