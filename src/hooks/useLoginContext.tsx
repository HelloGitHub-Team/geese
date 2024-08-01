import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import useSWR from 'swr';

import useToken from '@/hooks/useToken';

import { OAuthButton } from '@/components/buttons/LoginButton';
import BasicDialog from '@/components/dialog/BasicDialog';
import CustomLink from '@/components/links/CustomLink';

import { fetcher } from '@/services/base';
import { Logout } from '@/services/login';
import { makeUrl } from '@/utils/api';
import { NOOP } from '@/utils/constants';

import { UserStatusProps } from '@/types/user';

interface LoginContextProps {
  isLogin: boolean;
  isValidating: boolean;
  login: () => void;
  logout: () => void;
  theme: string;
  changeTheme: (theme: string) => void;
  updateUnread: () => void;
  userInfo?: UserStatusProps;
}

const LoginContext = createContext<LoginContextProps>({
  isLogin: false,
  isValidating: true,
  login: NOOP,
  logout: NOOP,
  theme: 'light',
  userInfo: {
    success: true,
    uid: '',
    nickname: '',
    avatar: '',
    contribute: 0,
    unread: {
      total: 0,
      repository: 0,
      system: 0,
    },
    level: 1,
    next_level_score: 0,
  },
  updateUnread: NOOP as any,
  changeTheme: NOOP as any,
});

export const LoginProvider = ({
  children,
}: {
  children: JSX.Element[] | any;
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { token, setToken } = useToken();
  const [isLogin, setIsLogin] = useState(!!token);
  const [theme, setTheme] = useState('light');
  const [visibleDialog, setVisibleDialog] = useState(false);

  const closeModal = () => {
    setVisibleDialog(false);
  };

  const login = () => {
    setVisibleDialog(true);
  };

  const {
    data: userInfo,
    isValidating,
    mutate,
  } = useSWR<UserStatusProps>(token ? makeUrl('/user/me/') : null, (key) => {
    const headers = { Authorization: `Bearer ${token}` };
    return fetcher(key, { headers });
  });

  const logout = useCallback(async () => {
    await Logout({ Authorization: `Bearer ${token}` });
    localStorage.clear();
    setToken(null);
  }, [token, setToken]);

  const changeTheme = (theme: string) => {
    setTheme(theme);
  };

  const updateUnread = useCallback(async () => {
    mutate(userInfo);
  }, [userInfo, mutate]);

  useEffect(() => {
    setIsLogin(!!token);
    // 校验 token 过期的话，则清理本地存储的 token
    if (
      !isValidating &&
      !!token &&
      typeof userInfo?.success !== 'undefined' &&
      !userInfo?.success
    ) {
      // 1. 请求 me 接口得到结果
      // 2. isLogin 为登录状态（这时有可能为过期token）
      // 3. 根据 me 接口的结果判断 token 是否过期
      // 4. isLogin 为 true 但 token 校验失败，则清理 localStorage
      localStorage.clear();
    }
    if (localStorage.theme) {
      setTheme(localStorage.theme);
    }
  }, [token, userInfo, isValidating]);

  const value = useMemo(
    () => ({
      isLogin,
      login,
      logout,
      changeTheme,
      updateUnread,
      theme,
      userInfo,
      isValidating,
    }),
    [userInfo, isLogin, isValidating, updateUnread, logout, theme]
  );

  return (
    <>
      <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
      {/* 登录弹窗 */}
      <BasicDialog
        className='login-dialog max-w-xs rounded-lg p-5'
        visible={visibleDialog}
        onClose={closeModal}
        hideClose
      >
        <div
          className='mb-4 flex flex-row justify-between border-b pb-2 dark:border-b-gray-600 dark:text-gray-300'
          onClick={closeModal}
        >
          <div className='font-medium'>{t('login.title')}</div>
          <div>
            <VscChromeClose
              size={18}
              className='cursor-pointer text-gray-500'
            />
          </div>
        </div>
        <div className='mx-auto px-10'>
          <div className='flex flex-col gap-3'>
            <OAuthButton platform='WeChat' backURL={router.asPath} t={t} />
            <OAuthButton platform='GitHub' backURL={router.asPath} t={t} />
          </div>

          <div className='mt-4 flex flex-row px-1 text-xs text-gray-500'>
            {t('login.tips')}
            <CustomLink className='inline' href='/help/ats'>
              <span className='ml-1 cursor-pointer text-blue-500'>
                {t('login.agreement')}
              </span>
            </CustomLink>
          </div>
        </div>
      </BasicDialog>
    </>
  );
};

export const useLoginContext = () => {
  return useContext(LoginContext);
};
