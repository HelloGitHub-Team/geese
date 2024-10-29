import React from 'react';

interface EmptyStateyProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateyProps> = ({ message }) => {
  return (
    <div className='mt-4 text-center text-xl'>
      <div className='py-14 text-gray-300 dark:text-gray-500'>{message}</div>
    </div>
  );
};

export const Divider = () => <div className='mx-1'>·</div>;
