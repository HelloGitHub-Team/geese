import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

import { redirectRecord } from '@/services/home';

import { NoPrefetchLink } from '../links/CustomLink';

import { AdvertItem } from '@/types/home';

interface Props {
  data: AdvertItem;
  i18n_lang: string;
  onClose: () => void;
}

const TopBanner = ({ data, i18n_lang, onClose }: Props) => {
  const [isClosed, setIsClosed] = useState(false);
  const adText = i18n_lang === 'en' ? data.text_en : data.text;
  const clickText = i18n_lang === 'en' ? 'Click' : '查看';

  const handleCloseAd = () => {
    setIsClosed(true);
    localStorage.adClosed = data.aid;
    onClose();
  };

  useEffect(() => {
    if (localStorage.adClosed === data.aid) {
      setIsClosed(true);
    }
  }, []);

  const onClickLink = (aid: string) => {
    redirectRecord('', aid, 'ad');
  };

  if (isClosed) return null;
  return (
    <div className='relative'>
      <NoPrefetchLink href={data.url}>
        <a
          target='_blank'
          onClick={() => onClickLink(data.aid)}
          className='block'
        >
          <div className='flex h-8 w-full items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 px-4 dark:from-blue-700/90 dark:to-blue-600/90'>
            <span className='max-w-[60%] truncate text-sm text-white'>
              {adText}
            </span>
            <span className='ml-2 shrink-0 text-xs text-white/90'>
              {clickText} →
            </span>
          </div>
        </a>
      </NoPrefetchLink>

      <button
        className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white opacity-80 transition-colors hover:opacity-100'
        onClick={handleCloseAd}
      >
        <IoMdClose className='h-4 w-4' />
      </button>
    </div>
  );
};
export default TopBanner;
