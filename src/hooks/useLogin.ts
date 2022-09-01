import { useCallback, useEffect, useState } from 'react';

import log from '@/lib/log';
import useToken from '@/hooks/useToken';

import { getOAtuhURL, Logout } from '@/services/login';

const useLogin = () => {
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
    setToken(null);
  }, [token, setToken]);

  useEffect(() => {
    setIsLogin(!!token);
  }, [token]);

  return {
    isLogin,
    login,
    logout,
  };
};

export default useLogin;
