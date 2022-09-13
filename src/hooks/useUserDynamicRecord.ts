import useSWR from 'swr';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { DynamicRecord } from '@/types/user';

/**
 * 获取用户动态
 */
export default function useUserDynamicRecord(uid: string) {
  const { data, error } = useSWR<{
    dynamicRecord: DynamicRecord[];
  }>(uid ? makeUrl(`/user/${uid}`) : null, fetcher);

  if (error) {
    return null;
  }
  return data?.dynamicRecord || null;
}
