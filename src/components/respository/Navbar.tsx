import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import { UserAvaterProps } from '@/types/user';

const Navbar: NextPage<UserAvaterProps> = ({ avatar }) => {
  const router = useRouter();

  return (
    <div className='flex items-center justify-between'>
      <div className='cursor-pointer py-2 pr-4' onClick={() => router.back()}>
        <AiOutlineArrowLeft className='text-blue-400' size={20} />
      </div>
      <strong className='text-center'>项目详情</strong>
      <div className='flex items-center justify-end text-xs text-gray-500'>
        由
        <div className='m-1 flex items-center'>
          <Image
            className='rounded-full'
            src={avatar}
            width={20}
            height={20}
            alt='头像'
          />
        </div>
        分享
      </div>
    </div>
  );
};

export default Navbar;
