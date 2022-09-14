import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { UserDetailInfo } from '@/types/user';

export default function useUserDetailInfo(uid: string) {
  const { data, error } = useSWRImmutable<{
    userInfo: UserDetailInfo;
  }>(uid ? makeUrl(`/user/${uid}`) : null, fetcher);

  if (error) {
    return null;
  }
  return data?.userInfo || null;
}
