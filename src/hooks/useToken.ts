import { useCallback, useEffect, useState } from 'react';

import { isClient } from '@/utils/util';

const useToken = () => {
  const TOKEN_KEY = 'Authorization';
  const tokenStorage = isClient() ? localStorage.getItem(TOKEN_KEY) : null;
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

export default useToken;
