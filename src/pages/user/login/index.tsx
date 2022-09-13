import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import useToken from '@/hooks/useToken';
import useUserInfo from '@/hooks/useUserInfo';

import { OAuthWechatAPI } from '@/services/login';

import { User, UserType } from '@/types/user';

interface IProps {
  token: string;
  userInfo: UserType;
  user_agent: string;
}

const Index = ({ token, userInfo, user_agent }: IProps) => {
  const router = useRouter();
  const { setToken } = useToken();
  const { setUserInfo } = useUserInfo();

  useEffect(() => {
    if (token) {
      // Perform localStorage action
      setToken(token);
      setUserInfo(userInfo);
    }
    // 微信内浏览器无法跳转 history
    if (user_agent.match(/MicroMessenger/i)) {
      router.push('/');
    } else {
      if (token) {
        // 返回触发登录时的页面。
        // 1.登录的流程需要触发 2 次页面跳转。
        // 2.一次是从触发登录的页面跳转到二维码页面。
        // 3.一次是从二维码页面跳转到本页面。
        // 4.所以返回 2 次正好是回到触发登录时的页面。
        window.history.go(-2);
      } else {
        // 登录失败则回到首页
        router.push('/');
      }
    }
  }, [token, userInfo, setUserInfo, setToken, user_agent, router]);

  return (
    <div className='bg-white'>
      {token ? (
        <div className='mt-2'>
          <div className='flex py-2.5 pl-4 pr-3'>登录成功，跳转中...</div>
        </div>
      ) : (
        <div className='m-2'>
          <div className='flex py-2.5 pl-4 pr-3'>登录失败，返回首页.</div>
        </div>
      )}
    </div>
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
    ip = req.socket.remoteAddress as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  try {
    token = '';
    userInfo = null;
    const data: User = await OAuthWechatAPI(
      code,
      state,
      cookie,
      user_agent,
      ip
    );
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
