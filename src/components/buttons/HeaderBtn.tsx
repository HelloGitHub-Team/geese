import { useRouter } from 'next/router';
import React from 'react';

import { debounce } from '@/utils/util';

import Button from './Button';

type HeaderBtnProps = {
  pathname: string;
  children: React.ReactNode;
};
const HeaderBtn = (props: HeaderBtnProps) => {
  const router = useRouter();
  const { pathname } = props;

  return (
    <Button
      className='font-normal text-current hover:bg-transparent dark:hover:bg-transparent'
      variant='ghost'
      onClick={debounce(() => {
        router.push(pathname);
      }, 200)}
    >
      {props.children}
    </Button>
  );
};

export default HeaderBtn;
