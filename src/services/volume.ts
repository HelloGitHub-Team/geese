import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface Volume {
  pre_num: number;
  next_num: number;
  current_num: number;
  publish_at: string;
  data: any[];
}

type VolumeAll = {
  total: number;
  data: any[];
};

export const getVolume = async (id: string): Promise<Volume> => {
  try {
    const data = await fetcher<Volume>(makeUrl(`/volume/?num=${id}`));
    return data;
  } catch (error) {
    return {} as Volume;
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

// 记录 github 访问次数 /v1/repository/go/github/
export const recordGoGithub = async (rid: string): Promise<any> => {
  try {
    await fetcher(makeUrl(`/repository/go/github/?rid=${rid}`));
  } catch (error) {
    console.error(error);
  }
};
