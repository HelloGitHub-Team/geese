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
  total: number;
  data: any[];
};

export const getVolume = async (id: string): Promise<Volume | boolean> => {
  try {
    const data = await fetcher<Volume>(makeUrl(`/volume/?num=${id}`));
    return data;
  } catch (error) {
    return false;
  }
};

export const getVolumeNum = async (): Promise<VolumeAll> => {
  try {
    const { total = 0, data = [] } =
      (await fetcher(makeUrl(`/volume/all/`))) || {};
    return { total, data };
  } catch (error) {
    return { total: 0, data: [] };
  }
};
