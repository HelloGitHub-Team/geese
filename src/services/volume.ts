import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { Volume, VolumeAll } from '@/types/volume';

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
    } = (await fetcher<VolumeAll>(makeUrl(`/volume/all/`))) || {};
    return { total, data, lastNum };
  } catch (error) {
    return { total: 0, data: [], lastNum: 0 };
  }
};
