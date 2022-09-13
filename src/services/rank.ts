import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface RankDataItem {
  name: string;
  position: number;
  rating: string;
  change: null | number;
  star: string;
}
interface RankData {
  success: boolean;
  month: number;
  year: number;
  month_list: number[];
  data: RankDataItem[];
}

export const getTiobeRank = async (month: number): Promise<RankData> => {
  let url = '/report/tiobe/';
  if (month) {
    url = `${url}?month=${month}`;
  }
  try {
    const data = await fetcher<RankData>(makeUrl(url));
    return data;
  } catch (error) {
    return false as RankData;
  }
};
