import Link from 'next/link';

import { OAuthURLProps } from '@/types/user';

const LoginLink = ({ wechatOAtuhURL }: OAuthURLProps) => {
  return (
    <Link href={wechatOAtuhURL || '/'}>
      <span className='inline-flex cursor-pointer items-center rounded-lg px-3 py-2'>
        登录
      </span>
    </Link>
  );
};
export default LoginLink;
