import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { UserStatus } from '@/pages/api/login';

type UserProps = {
  user: UserStatus;
  isLogin: boolean;
};

type UserStatusProps = {
  user: UserStatus;
};

const User = ({ isLogin, user }: UserProps) => {
  const defaultAvatar =
    'https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132';

  const UserStatus = ({ user }: UserStatusProps) => (
    <React.Fragment>
      <div className='relative'>
        {/* /users/314838220949536768 */}
        <Link href={user.uid ? '/users/' + user.uid : '_blank'}>
          <span className='bg-img absolute top-0 left-0 h-10 w-10 shrink-0 grow-0 rounded-lg object-cover'>
            {/* https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132 */}
            <Image
              width={40}
              height={40}
              alt='Picture of the author'
              src={user.avatar || defaultAvatar}
            ></Image>
          </span>
        </Link>
        <div className='shrink grow pl-12'>
          <div className='flex min-w-0 items-center'>
            <a
              className='mr-2 block h-5 shrink grow truncate text-sm hover:underline'
              href='/users/314838220949536768'
            >
              {user.nickname}
            </a>
          </div>
          <div className='text-sm font-bold text-yellow-500'>Lv1</div>
        </div>
      </div>

      <div className='flex items-end pt-2 text-sm'>
        <div className='shrink grow'></div>
        <div className='pr-2 pb-0.5 text-slate-400'>我的积分</div>
        <div className='text-4xl font-bold text-yellow-500'>15</div>
      </div>
    </React.Fragment>
  );

  const NotLogin = () => (
    <p className='py-5 text-center align-middle text-base text-slate-400'>
      未登录
    </p>
  );

  return (
    <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5'>
      {isLogin ? <UserStatus user={user} /> : <NotLogin />}
    </div>
  );
};

export default User;
