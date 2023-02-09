import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import useToken from '@/hooks/useToken';

import { LoginModal } from '@/components/user/Login';

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
    console.log(children);
    return <LoginModal>{children}</LoginModal>;
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
