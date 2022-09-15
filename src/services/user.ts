import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import type { Response } from '@/types/user';

// /v1/user/{uid}
export const getUserInfo = (uid: string) =>
  fetcher<Response>(makeUrl(`/user/${uid}`));
