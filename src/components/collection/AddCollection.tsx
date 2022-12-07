import * as React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import clsxm from '@/lib/clsxm';

type AddCollectionProps = {
  title?: string;
} & React.ComponentPropsWithoutRef<'div'>;

export default function AddCollection({
  className,
  ...rest
}: AddCollectionProps) {
  const { title = '新建收藏夹' } = rest;

  return (
    <div className={clsxm('', className)} {...rest}>
      <button
        type='button'
        className='inline-flex items-center justify-center gap-2 rounded-md border border-transparent py-1 px-0 text-sm font-semibold text-blue-500 ring-offset-white transition-all hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        <AiOutlinePlus /> {title}
      </button>
    </div>
  );
}
