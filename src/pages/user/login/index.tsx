import { GetServerSidePropsContext } from 'next';
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
    // 返回触发登录时的页面。
    // 1.登录的流程需要触发 2 次页面跳转。
    // 2.一次是从触发登录的页面跳转到二维码页面。
    // 3.一次是从二维码页面跳转到本页面。
    // 4.所以返回 2 次正好是回到触发登录时的页面。
    window.history.go(-2);
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
