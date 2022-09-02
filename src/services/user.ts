import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

// /v1/user/{uid}
export const getUserInfo = (uid: string) => fetcher(makeUrl(`/user/${uid}`));
