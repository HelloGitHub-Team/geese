import { licenseDetail, licenseList, licenseTags } from './license.data';

import { LicenseDetailFetchData, LicenseListFetchData } from '@/types/license';

// 获取协议详情
export const getLicenseDetail = async (
  ip: string,
  lid: string
): Promise<LicenseDetailFetchData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const url = `/licenses/${lid}`;
  try {
    // const data = await fetcher<LicenseDetailFetchData>(makeUrl(url), req);
    // return data;
    return licenseDetail;
  } catch (error) {
    return {} as LicenseDetailFetchData;
  }
};

// 获取协议列表
export const getLicenseList = async (query: {
  page: number;
  pageSize: number;
  sort_by: string;
  tid: string[];
}): Promise<LicenseListFetchData> => {
  let url = '/licenses/?';
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (!Array.isArray(value)) {
      url += `${key}=${value}&`;
    }
  });
  Array.isArray(query.tid) &&
    query.tid.forEach((key) => {
      const value = query[key];
      url += `${tid}=${value}&`;
    });

  console.log({ url });

  try {
    // const data = await fetcher<LicenseDetailFetchData>(makeUrl(url), req);
    // return data;
    return licenseList;
  } catch (error) {
    return {} as LicenseDetailFetchData;
  }
};

// 获取筛选标签
export const getLicenseTags = async (): Promise<LicenseTagsFetchData> => {
  const url = '/licenses/tags';

  try {
    // const data = await fetcher<LicenseDetailFetchData>(makeUrl(url), req);
    // return data;
    return licenseTags;
  } catch (error) {
    return {} as LicenseTagsFetchData;
  }
};
