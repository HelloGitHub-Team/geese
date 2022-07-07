import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/pages/api/base';
import { makeUrl } from '@/utils/api';

import SearchInput from '../search/SearchInput';

interface IProps {
  loginStatus: boolean;
  updateLoginStatus: (val: boolean) => void;
}

const Header = ({ loginStatus, updateLoginStatus }: IProps) => {
  const router = useRouter();

  const { data } = useSWRImmutable<Record<string, any>>(
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

  const handleLoginOut = async () => {
    try {
      // const token = localStorage.getItem('Authorization');
      // const result: any = await LoginOut({ Authorization: `Bearer ${token}` });
      localStorage.clear();
      updateLoginStatus(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className='fixed z-10 h-14 w-full bg-white shadow-md'>
      <nav className='mx-auto flex max-w-5xl items-center justify-between p-2'>
        <Image
          className='h-8 cursor-pointer'
          src='https://raw.githubusercontent.com/521xueweihan/img_logo/main/logo/logo.png'
          width='30'
          height='30'
          alt='hellogithub'
          onClick={() => router.push('/')}
        />
        <SearchInput />
        <ul className='text-md flex items-center space-x-2 font-medium text-gray-500'>
          <li>
            <Link href='/user/login/' className='rounded-lg px-3 py-2'>
              月刊
            </Link>
          </li>
          <>
            {!loginStatus ? (
              <li className='block md:hidden'>
                {/* <li className='md:hidden block'> */}
                <Link href={data?.url || '/'}>
                  <span className='inline-flex cursor-pointer items-center rounded-lg px-3 py-2'>
                    登录
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className='ml-1.5 h-4 w-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      ></path>
                    </svg>
                  </span>
                </Link>
              </li>
            ) : (
              <li className='block md:hidden'>
                <button onClick={handleLoginOut}>
                  <span className='inline-flex items-center rounded-lg px-3 py-2'>
                    退出
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className='ml-1.5 h-4 w-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      ></path>
                    </svg>
                  </span>
                </button>
              </li>
            )}
          </>
        </ul>
      </nav>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const url = makeUrl(`/user/oauth/wechat/url/`, {url_type: 'geese'})

//   const OAuthURLRes = await getOAuthURL()
//   console.log(OAuthURLRes)
//   const data = await OAuthURLRes.json()
//   const cookie = OAuthURLRes.headers.get("set-cookie");
//   if (cookie) {
//     res.setHeader("set-cookie", cookie);
//   }

//   return {
//     props: {
//       OAuthURL: data.url
//     },
//   };
// };

export default Header;
