import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useToken from '@/hooks/useToken';

import RedirectBar from '@/components/navbar/RedirectBar';

import { OAuthLoginAPI } from '@/services/login';
import { OAUTH_LOGIN_KEY } from '@/utils/constants';

import { User, UserType } from '@/types/user';

interface IProps {
  token: string;
  userInfo: UserType;
}

const Index = ({ token, userInfo }: IProps) => {
  const router = useRouter();
  const { setToken } = useToken();

  useEffect(() => {
    if (token) {
      // Perform localStorage action
      setToken(token);
      router.push(localStorage.getItem(OAUTH_LOGIN_KEY) as string);
    } else {
      // 登录失败则回到首页
      router.push('/');
    }
  }, [token, userInfo, setToken, router]);

  return (
    <>
      {token ? (
        <RedirectBar text='登录成功，跳转中...' />
      ) : (
        <RedirectBar text='登录失败，返回首页...' />
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, query } = context;
  let token, userInfo, ip;
  const code = query.code as string;
  const state = query.state as string;
  const cookie = req.headers.cookie as string;
  const user_agent = req.headers['user-agent'] as string;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }
  try {
    token = '';
    userInfo = null;
    const data: User = await OAuthLoginAPI(ip, code, state, cookie, user_agent);
    if (typeof data.uid === 'undefined') {
      token = '';
      userInfo = null;
      return {
        props: { token, userInfo, user_agent },
      };
    } else {
      token = data.token;
      userInfo = data.userInfo;
      return {
        props: { token, userInfo, user_agent },
      };
    }
  } catch (error) {
    return {
      props: { token, userInfo, user_agent },
    };
  }
}

export default Index;
