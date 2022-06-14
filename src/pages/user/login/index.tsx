import Router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import { OAuthWechatAPI } from '@/pages/api/login';
import { User } from '@/utils/types/userType';

const Index = ({ token, userInfo }, { token: string }) => {
  useEffect(() => {
    if (token != undefined) {
      // Perform localStorage action
      localStorage.setItem('Authorization', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    // 返回首页
    Router.push('/');
  }, []);
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

// const Index = ({}) => {
// const router = useRouter()
// console.log('router:')
// console.log(router)
// useEffect(() => {
//   if(router.query?.code == undefined){
//     // 没有必要参数返回首页
//     Router.push('/')
//   }
// }, [])
// const reqData: RequestInit = {}
// reqData.credentials = 'include'
// reqData.headers = {
//   'Content-Type': 'application/json',
// }
// reqData.method = "POST"
// reqData.body = JSON.stringify({code: 2323, state: 12})

// const { data, error } = useSWR(
//   [makeUrl('/user/oauth/wechat/'), reqData],
//   fetch);

// console.log(error)
// console.log(data)
