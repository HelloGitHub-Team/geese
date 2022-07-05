import Router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import { OAuthWechatAPI } from '@/pages/api/login';
import { User } from '@/utils/types/userType';

interface IProps {
  token: string;
  userInfo: string;
}

const Index = ({ token, userInfo }: IProps) => {
  useEffect(() => {
    if (token != undefined) {
      // Perform localStorage action
      localStorage.setItem('Authorization', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    // 返回首页
    Router.push('/');
  }, [token, userInfo]);

  return (
    <div>
      <div>登录中...</div>
    </div>
  );
};

Index.getInitialProps = async ({ req, query }) => {
  let token, userInfo;
  try {
    const { code, state } = query;
    const cookie = req.headers.cookie;
    const data: User = await OAuthWechatAPI(code, state, cookie);
    token = data.token;
    userInfo = data.userInfo;
    return { token, userInfo };
  } catch (error) {
    console.log(error);
    console.log('登录失败');
    return { token, userInfo };
  }
};

export default Index;
