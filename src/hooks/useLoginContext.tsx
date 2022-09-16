import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import log from '@/lib/log';
import useToken from '@/hooks/useToken';

import { getOAtuhURL, Logout } from '@/services/login';
import { NOOP } from '@/utils/constants';

const LoginContext = createContext({
  isLogin: false,
  login: NOOP,
  logout: NOOP,
});

export const LoginProvider = ({ children }: { children: JSX.Element[] }) => {
  const { token, setToken } = useToken();
  const [isLogin, setIsLogin] = useState(!!token);
  const login = useCallback(async () => {
    try {
      const { url } = await getOAtuhURL();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      log.error(err);
    }
  }, []);
  const logout = useCallback(async () => {
    await Logout({ Authorization: `Bearer ${token}` });
    localStorage.clear();
    setToken(null);
  }, [token, setToken]);

  useEffect(() => {
    setIsLogin(!!token);
  }, [token]);

  return (
    <LoginContext.Provider value={{ isLogin, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  return useContext(LoginContext);
};
