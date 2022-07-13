import Link from 'next/link';

import { OAuthURLProps } from '@/types/user';

const LoginButton = ({ wechatOAtuhURL }: OAuthURLProps) => {
  return (
    <div className='box-border py-6 text-center align-middle text-base'>
      <Link href={wechatOAtuhURL || '/'}>
        <button
          type='button'
          className='button box-border rounded-md border-2 border-slate-400 px-3 py-2 text-gray-500'
        >
          立即登录
        </button>
      </Link>
    </div>
  );
};

export default LoginButton;
