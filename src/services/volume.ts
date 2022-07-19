import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

interface Volume {
  pre_num: number;
  next_num: number;
  current_num: number;
  publish_at: string;
  data: any[];
}

export const getVolume = async (id: string): Promise<Volume> => {
  try {
    const data = await fetcher<Volume>(makeUrl(`/volume/?num=${id}`));
    return data;
  } catch (error) {
    return {};
  }
};
