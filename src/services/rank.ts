import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { NetcraftRankData, RankData } from '@/types/rank';

// 编程语言排名
export const getTiobeRank = async (
  ip: string,
  month?: number
): Promise<RankData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  let url = '/report/tiobe/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<RankData>(makeUrl(url), req);
    return data;
  } catch (error) {
    return {} as RankData;
  }
};

// 服务器排名
export const getNetcraftRank = async (
  ip: string,
  month?: number
): Promise<NetcraftRankData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  let url = '/report/netcraft/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<NetcraftRankData>(makeUrl(url), req);
    return data;
  } catch (error) {
    return {} as NetcraftRankData;
  }
};

// 数据库排名
export const getDBRank = async (
  ip: string,
  month?: number
): Promise<RankData> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  let url = '/report/db/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<RankData>(makeUrl(url), req);
    return data;
  } catch (error) {
    return {} as RankData;
  }
};
