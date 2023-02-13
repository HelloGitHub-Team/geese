import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import {
  LicenseDetailFetchData,
  LicenseListFetchData,
  LicenseTagsFetchData,
} from '@/types/license';

// 获取协议详情
export const getLicenseDetail = async (
  ip: string,
  lid: string
): Promise<LicenseDetailFetchData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const url = `/license/${lid}`;
  try {
    const data = await fetcher<LicenseDetailFetchData>(makeUrl(url), req);
    return data;
  } catch (error) {
    console.log(error);
    return {} as LicenseDetailFetchData;
  }
};

// 获取协议列表
export const getLicenseList = async (query: {
  page: number;
  pageSize: number;
  sort_by: string;
  tids: string[];
}): Promise<LicenseListFetchData> => {
  let url = '/license/?';
  Object.keys(query).forEach((key: string) => {
    const value = query[key as string];
    if (!Array.isArray(value)) {
      url += `${key}=${value}&`;
    }
  });
  Array.isArray(query.tids) &&
    query.tids.forEach((key) => {
      url += `tid=${key}&`;
    });

  console.log({ url });

  try {
    const data = await fetcher<LicenseListFetchData>(makeUrl(url));
    return data;
  } catch (error) {
    console.log(error);
    return {} as LicenseListFetchData;
  }
};

// 获取筛选标签
export const getLicenseTags = async (): Promise<LicenseTagsFetchData> => {
  const url = '/license/tags/?tag_type=permissions';

  try {
    const data = await fetcher<LicenseTagsFetchData>(makeUrl(url));
    return data;
  } catch (error) {
    console.log(error);
    return {} as LicenseTagsFetchData;
  }
};
