import { NextPage } from 'next';

import Ad from '@/components/side/Ad';

import { AdvertItem } from '@/types/home';

interface Props {
  data: AdvertItem[];
  displayAdOnly?: boolean;
  t: (key: string) => string;
  i18n_lang?: string;
}

export const SideAd: NextPage<Props> = ({ data, t, i18n_lang }) => {
  return (
    <div className='space-y-1'>
      {data.map((item: AdvertItem) => (
        <Ad key={item.aid} data={item} t={t} i18n_lang={i18n_lang} />
      ))}
    </div>
  );
};

export const SideFixAd: NextPage<Props> = ({
  data,
  displayAdOnly,
  t,
  i18n_lang,
}) => {
  return (
    <div
      className='fixed top-16 ml-3 max-w-[244px] space-y-2'
      hidden={!displayAdOnly}
    >
      {data.map((item: AdvertItem) => (
        <Ad key={item.aid} data={item} t={t} i18n_lang={i18n_lang} />
      ))}
    </div>
  );
};
