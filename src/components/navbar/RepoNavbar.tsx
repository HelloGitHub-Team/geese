import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import { UserAvaterProps } from '@/types/user';

const RepoDetailNavbar: NextPage<UserAvaterProps> = ({ avatar, uid }) => {
  const router = useRouter();

  return (
    <div className='my-2 bg-white'>
      <div className='flex h-12 items-center justify-between py-2 px-4'>
        <div className='cursor-pointer pr-4' onClick={() => router.back()}>
          <AiOutlineArrowLeft className='text-blue-400' size={20} />
        </div>
        <div className='text-center font-bold'>项目详情</div>
        <div className='flex items-center justify-end text-xs text-gray-500'>
          由
          <Link href={`/user/${uid}`}>
            <a className='m-1 flex items-center'>
              <Image
                className='rounded-full'
                src={avatar}
                width={20}
                height={20}
                alt='头像'
              />
            </a>
          </Link>
          分享
        </div>
      </div>
    </div>
  );
};

export default RepoDetailNavbar;
