import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

import useToken from '@/hooks/useToken';

import RedirectBar from '@/components/navbar/RedirectBar';

import { OAuthLoginAPI } from '@/services/login';
import { OAUTH_LOGIN_KEY } from '@/utils/constants';
import { getClientIP } from '@/utils/util';

import { User, UserType } from '@/types/user';

interface IProps {
  token: string;
  userInfo: UserType;
}

const Index = ({ token, userInfo }: IProps) => {
  const { t, i18n } = useTranslation('commn');
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
    <RedirectBar
      text={t('login.redirect_bar_text')}
      i18n_lang={i18n.language}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, query, locale } = context;
  const { code, state } = query as { code: string; state: string };
  const cookie = req.headers.cookie as string;
  const user_agent = req.headers['user-agent'] as string;
  const ip = getClientIP(req);

  try {
    const data: User = await OAuthLoginAPI(ip, code, state, cookie, user_agent);

    if (data.uid) {
      return {
        props: {
          token: data.token,
          userInfo: data.userInfo,
        },
      };
    }
  } catch (error) {
    console.error('OAuth login error:', error);
  }

  return {
    props: {
      token: '',
      userInfo: null,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
}

export default Index;
