import { useEffect, useState } from 'react';

import { UserType } from '@/types/user';

const useUserInfo = () => {
  const storageKey = 'userInfo';
  const [info, setInfo] = useState<UserType>({
    uid: '',
    nickname: '',
    avatar: '',
  });

  useEffect(() => {
    const info = localStorage.getItem(storageKey);
    info && setInfo(JSON.parse(info));
  }, []);

  const setUserInfo = (info: UserType) => {
    localStorage.setItem(storageKey, JSON.stringify(info));
    setInfo(info);
  };

  return {
    userInfo: info,
    setUserInfo,
  };
};

export default useUserInfo;
