import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
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

const LoginContext = createContext({
  isLogin: false,
  isValidating: true,
  login: NOOP,
  logout: NOOP,
  theme: 'light',
  data: {
    success: true,
    uid: '',
    nickname: '',
    avatar: '',
    contribute: 0,
    unread_total: 0,
    level: 1,
    next_level_score: 0,
  } as any,
  changeTheme: (theme: string) => {
    theme;
  },
});

export const LoginProvider = ({
  children,
}: {
  children: JSX.Element[] | any;
}) => {
  const router = useRouter();
  const { token, setToken } = useToken();
  const [isLogin, setIsLogin] = useState(!!token);
  const [theme, setTheme] = useState('light');

  const login = () => {
    const div = document.createElement('div');
    function closeModal() {
      document.body.removeChild(div);
    }
    const LoginDialog = (
      <BasicDialog
        className='login-dialog max-w-xs rounded-lg p-5'
        visible
        hideClose
      >
        <div
          className='mb-4 flex flex-row justify-between border-b pb-2 dark:border-b-gray-600 dark:text-gray-300'
          onClick={closeModal}
        >
          <div className='font-medium'>选择登录方式</div>
          <div>
            <VscChromeClose
              size={18}
              className='cursor-pointer text-gray-500'
            />
          </div>
        </div>
        <div className='mx-auto px-10'>
          <div className='flex flex-col gap-3'>
            <OAuthButton platform='WeChat' backURL={router.asPath} />
            <OAuthButton platform='GitHub' backURL={router.asPath} />
          </div>

          <div className='mt-4 flex flex-row px-1 text-xs text-gray-500'>
            登录即表示同意
            <CustomLink className='inline' href='/help/ats'>
              <span className='ml-1 cursor-pointer text-blue-500'>
                服务协议
              </span>
            </CustomLink>
          </div>
        </div>
      </BasicDialog>
    );

    const root = createRoot(div);
    root.render(LoginDialog);
    document.body.appendChild(div);

    // 使弹窗有过度动画
    const dialog = div.querySelector('.login-dialog');
    if (dialog) {
      dialog.classList.add('scale-90');
      dialog.classList.remove('scale-100');
      requestAnimationFrame(() => {
        dialog.classList.add('scale-100');
      });
    }
  };

  const { data, isValidating } = useSWR<UserStatusProps>(
    token ? makeUrl('/user/me/') : null,
    (key) => {
      const headers = { Authorization: `Bearer ${token}` };
      console.log('content');
      return fetcher(key, { headers });
    }
  );

  const logout = useCallback(async () => {
    await Logout({ Authorization: `Bearer ${token}` });
    localStorage.clear();
    setToken(null);
  }, [token, setToken]);

  const changeTheme = (theme: string) => {
    setTheme(theme);
  };

  useEffect(() => {
    setIsLogin(!!token);
  }, [token]);

  return (
    <LoginContext.Provider
      value={{ isLogin, login, logout, changeTheme, theme, data, isValidating }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  return useContext(LoginContext);
};
