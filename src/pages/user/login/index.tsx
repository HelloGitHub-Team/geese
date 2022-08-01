import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import useToken from '@/hooks/useToken';
import useUserInfo from '@/hooks/useUserInfo';

import { OAuthWechatAPI } from '@/services/login';

import { User, UserType } from '@/types/user';

interface IProps {
  token: string;
  userInfo: UserType;
}

const Index = ({ token, userInfo }: IProps) => {
  const { setToken } = useToken();
  const { setUserInfo } = useUserInfo();

  useEffect(() => {
    if (token != undefined) {
      // Perform localStorage action
      setToken(token);
      setUserInfo(userInfo);
    }
    // 返回首页
    Router.push('/');
  }, [token, userInfo, setUserInfo, setToken]);

  return (
    <div>
      <div>登录中...</div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, query } = context;
  let token, userInfo;
  try {
    const code = query.code as string;
    const state = query.state as string;
    const cookie = req.headers.cookie as string;

    const data: User = await OAuthWechatAPI(code, state, cookie);
    token = data.token;
    userInfo = data.userInfo;
    return {
      props: { token, userInfo },
    };
  } catch (error) {
    console.log(error);
    console.log('登录失败');
    return {
      props: { token, userInfo },
    };
  }
}

export default Index;
