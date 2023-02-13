import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { render } from 'react-dom';
import { VscChromeClose } from 'react-icons/vsc';

import useToken from '@/hooks/useToken';

import { GitHubButton, WechatButton } from '@/components/buttons/LoginButton';
import BasicDialog from '@/components/dialog/BasicDialog';
import CustomLink from '@/components/links/CustomLink';

import { Logout } from '@/services/login';
import { NOOP } from '@/utils/constants';

const LoginContext = createContext({
  isLogin: false,
  login: NOOP,
  logout: NOOP,
  theme: 'light',
  changeTheme: (theme: string) => {
    theme;
  },
});

export const LoginProvider = ({
  children,
}: {
  children: JSX.Element[] | any;
}) => {
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
        className='max-w-xs rounded-lg p-5'
        visible
        hideClose
        onClose={closeModal}
      >
        <div
          className='mb-4 flex flex-row justify-between border-b pb-2 '
          onClick={closeModal}
        >
          <div className='font-medium '>选择登录方式</div>
          <div>
            <VscChromeClose
              size={18}
              className='cursor-pointer text-gray-500'
            />
          </div>
        </div>
        <div className='mx-auto px-10'>
          <div className='flex flex-col gap-3'>
            <GitHubButton />
            <WechatButton />
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

    render(LoginDialog, div);
    document.body.appendChild(div);
  };

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
      value={{ isLogin, login, logout, changeTheme, theme }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  return useContext(LoginContext);
};
