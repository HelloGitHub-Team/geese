import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { BulletsResponse, Volume, VolumeAll } from '@/types/periodical';

export const getVolume = async (num?: number): Promise<Volume> => {
  try {
    if (num) {
      const data = await fetcher<Volume>(
        makeUrl(`/periodical/volume/`, { num: num })
      );
      return data;
    } else {
      const data = await fetcher<Volume>(makeUrl(`/periodical/volume/`));
      return data;
    }
  } catch (error) {
    return {
      success: false,
      page_total: 0,
      total: 0,
      current_num: 0,
      data: [],
    };
  }
};

export const getVolumeNum = async (): Promise<VolumeAll> => {
  try {
    const {
      success = false,
      total = 0,
      data = [],
    } = (await fetcher<VolumeAll>(makeUrl(`/periodical/volume/all/`))) || {};
    return { success, total, data };
  } catch (error) {
    return { success: false, total: 0, data: [] };
  }
};

export const getVolumeBullets = async (
  num?: number
): Promise<BulletsResponse> => {
  try {
    const url = num
      ? makeUrl('/periodical/volume/bullets/', { num })
      : makeUrl('/periodical/volume/bullets/');
    const data = await fetcher<BulletsResponse>(url);
    return data;
  } catch (error) {
    return { success: false, total: 0, data: [] };
  }
};
