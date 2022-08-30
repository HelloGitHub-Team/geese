import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface Volume {
  pre_num: number;
  next_num: number;
  total: number;
  current_num: number;
  publish_at: string;
  data: any[];
}

type VolumeAll = {
  lastNum: number;
  total: number;
  data: any[];
};

export const getVolume = async (num: number): Promise<Volume | boolean> => {
  try {
    const data = await fetcher<Volume>(makeUrl(`/volume/${num}`));
    return data;
  } catch (error) {
    return false;
  }
};

export const getVolumeNum = async (): Promise<VolumeAll> => {
  try {
    const {
      total = 0,
      data = [],
      lastNum = 0,
    } = (await fetcher(makeUrl(`/volume/all/`))) || {};
    return { total, data, lastNum };
  } catch (error) {
    return { total: 0, data: [], lastNum: 0 };
  }
};
