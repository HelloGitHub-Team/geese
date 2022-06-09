import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

const User = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5'>
      <div className='relative'>
        <Link href='/users/314838220949536768'>
          <span className='bg-img absolute top-0 left-0 h-10 w-10 shrink-0 grow-0 rounded-lg object-cover'>
            <Image
              width={40}
              height={40}
              src='https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132'
            ></Image>
          </span>
        </Link>
        <div className='shrink grow pl-12'>
          <div className='flex min-w-0 items-center'>
            <a
              className='mr-2 block shrink grow truncate text-sm hover:underline'
              href='/users/314838220949536768'
            >
              卤蛋
            </a>
          </div>
          <div className='text-sm font-bold text-yellow-500'>Lv1</div>
        </div>
      </div>

      <div className='flex items-end pt-2 text-sm'>
        <div className='shrink grow'></div>
        <div className='pr-2 pb-0.5 text-slate-400'>我的积分</div>
        <div className='text-3xl font-bold text-yellow-500'>15</div>
      </div>
    </div>
  );
};

export default User;
