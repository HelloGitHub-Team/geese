import { useCallback, useEffect, useState } from 'react';

import { isClient } from '@/utils/util';

import { UserType } from '@/types/user';

const useUserInfo = () => {
  const storageKey = 'userInfo';
  const storageInfo = isClient() ? localStorage.getItem(storageKey) : null;
  const [info, setInfo] = useState<UserType>({
    uid: '',
    nickname: '',
    avatar: '',
  });

  useEffect(() => {
    storageInfo && setInfo(JSON.parse(storageInfo));
  }, [storageInfo]);

  const setUserInfo = useCallback((info: UserType) => {
    localStorage.setItem(storageKey, JSON.stringify(info));
    setInfo(info);
  }, []);

  return {
    userInfo: info,
    setUserInfo,
  };
};

export default useUserInfo;
