import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { LicenseDetailFetchData } from '@/types/license';

// 获取协议详情
export const getLicenseDetail = async (
  ip: string,
  lid: string
): Promise<LicenseDetailFetchData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const url = `/licenses/${lid}`;
  try {
    const data = await fetcher<LicenseDetailFetchData>(makeUrl(url), req);
    return data;
  } catch (error) {
    return {} as LicenseDetailFetchData;
  }
};
