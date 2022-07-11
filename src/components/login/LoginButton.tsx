import Link from 'next/link';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { OAuthURLResponse } from '@/typing/user';
import { makeUrl } from '@/utils/api';

const LoginButton = () => {
  const { data } = useSWRImmutable<OAuthURLResponse>(
    makeUrl(`/user/oauth/wechat/url/`, { url_type: 'geese' }),
    (key) => {
      const options: RequestInit = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      };
      return fetcher(key, options);
    },
    {
      shouldRetryOnError: false,
    }
  );
  return (
    <div className='box-border py-6 text-center align-middle text-base'>
      <Link href={data?.url || '/'}>
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
