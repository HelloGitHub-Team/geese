import useSWRImmutable from 'swr/immutable';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { AdvertItems } from '@/types/home';

export const useSponsor = () => {
  const { data, isValidating } = useSWRImmutable<AdvertItems>(
    makeUrl('/sponsor/'),
    fetcher
  );

  const topAd = data?.success
    ? data.data.find((item) => item.position === 'top')
    : null;
  const sideAds = data?.success
    ? data.data.filter((item) => item.position === 'side')
    : [];

  return {
    topAd,
    sideAds,
    isValidating,
  };
};
