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
  autoClose?: boolean;
  onClose: () => void;
}

function Message(props: MessageProps) {
  const { type, content, onClose } = props;
  const wrapClassName = (type: string) =>
    classNames(
      'inline-block rounded border border-green-900/10 bg-green-50 p-2 text-green-700',
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
        <IoMdCheckmarkCircleOutline size={18} className='text-green-600' />
      ),
      warning: (
        <IoIosInformationCircleOutline size={18} className='text-amber-600' />
      ),
      error: <IoMdCloseCircleOutline size={18} className='text-red-600' />,
      info: (
        <IoIosInformationCircleOutline size={18} className='text-sky-600' />
      ),
    };
    return (
      <span className='p-1 text-white'>
        {iconMap[type as keyof typeof iconMap]}
      </span>
    );
  };

  return (
    <div className={wrapClassName(type)} role='alert'>
      <div className='pointer-events-auto flex'>
        <div className='mr-5 flex items-center gap-4'>
          {icon(type)}
          <span className='block text-base opacity-90'>{content}</span>
        </div>

        {!props.autoClose && (
          <button className='opacity-90' type='button' onClick={onClose}>
            <span className='sr-only'> Close </span>
            <IoMdClose className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );
}

export default Message;
