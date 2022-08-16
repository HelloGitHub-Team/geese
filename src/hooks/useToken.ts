import { useCallback, useEffect, useState } from 'react';

import { isClient } from '@/utils/util';

const TOKEN_KEY = 'Authorization';

const useToken = () => {
  const tokenStorage = getCurrentToken();
  const [token, setToken] = useState<string | null>(null);
  const handleTokenChange = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(token);
  }, []);

  useEffect(() => {
    setToken(tokenStorage);
  }, [tokenStorage]);

  return {
    token,
    setToken: handleTokenChange,
  };
};

export const getCurrentToken = () => {
  return isClient() ? localStorage.getItem(TOKEN_KEY) : null;
};

export default useToken;
