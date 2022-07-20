import classNames from 'classnames';
import React, { ReactNode } from 'react';

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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </span>
      ),
      warning: (
        <span className='rounded-full bg-amber-600 p-2 text-white'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </span>
      ),
      error: (
        <span className='rounded-full bg-red-600 p-2 text-white'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01'
            />
          </svg>
        </span>
      ),
      info: (
        <span className='rounded-full bg-sky-600 p-2 text-white'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
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

          <svg
            className='h-4 w-4'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Message;
