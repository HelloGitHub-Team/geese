import { useCallback, useEffect, useState } from 'react';

const useToken = () => {
  const TOKEN_KEY = 'Authorization';
  const tokenStorage = localStorage.getItem(TOKEN_KEY);
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
