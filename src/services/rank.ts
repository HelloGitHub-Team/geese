import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { NetcraftRankData, RankData } from '@/types/rank';

// 编程语言排名
export const getTiobeRank = async (month?: number): Promise<RankData> => {
  let url = '/report/tiobe/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<RankData>(makeUrl(url));
    return data;
  } catch (error) {
    return {} as RankData;
  }
};

// 服务器排名
export const getNetcraftRank = async (
  month?: number
): Promise<NetcraftRankData> => {
  let url = '/report/netcraft/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<NetcraftRankData>(makeUrl(url));
    return data;
  } catch (error) {
    return {} as NetcraftRankData;
  }
};

// 数据库排名
export const getDBRank = async (month?: number): Promise<RankData> => {
  let url = '/report/db/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<RankData>(makeUrl(url));
    return data;
  } catch (error) {
    return {} as RankData;
  }
};
