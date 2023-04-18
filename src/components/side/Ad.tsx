import Link from 'next/link';
import { MouseEventHandler, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

import { recordGoAdvert, redirectRecord } from '@/services/home';
import { PUTAdURL } from '@/utils/constants';

import { AdvertItem } from '@/types/home';

interface Props {
  data: AdvertItem;
  className?: string;
}

export default function Ad(props: Props) {
  const [visible, setVisible] = useState(true);
  const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setVisible(false);
  };

  const onClickLink = (aid: string) => {
    recordGoAdvert(aid);
    redirectRecord('', aid, 'ad');
  };

  return (
    <div
      className={`${props.className} relative h-20 overflow-hidden rounded-lg bg-white dark:bg-gray-800`}
      hidden={!visible}
    >
      {props.data.is_reward ? (
        <div className='flex flex-row p-3'>
          <img
            className='h-[55px] w-[55px]'
            src={props.data.image_url}
            alt='ad'
          />
          <div className='ml-3'>
            <div className='text-base font-medium tracking-wider'>
              微信扫码赞助本站
            </div>
            <div className='mt-1.5 mb-1 text-xs text-gray-500'>
              <span>
                服务器还剩<strong className='mx-1'>{props.data.day}</strong>天
              </span>
              <div className='relative left-0.5 bottom-1 inline-flex w-fit'>
                <span className='text-xs font-medium text-blue-500 '>
                  <span className='mr-[0.5px]'>+{props.data.year}</span>年
                </span>
              </div>
            </div>
            <div className='flex h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className='flex flex-col justify-center overflow-hidden bg-blue-500'
                style={{
                  width: `${props.data.percent}%`,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Link href={props.data.url}>
          <a
            target='_blank'
            onClick={() => onClickLink(props.data.aid)}
            rel='noreferrer'
          >
            <div className='group relative h-full'>
              <img
                className='h-full w-full'
                src={props.data.image_url}
                alt='ad'
              />
              <div
                className='absolute top-0 right-0 hidden cursor-pointer p-1.5 text-inherit opacity-30 group-hover:block'
                onClick={handleClose}
              >
                <VscClose size={20} />
              </div>
            </div>
          </a>
        </Link>
      )}

      {props.data.is_ad ? (
        <Link href={PUTAdURL}>
          <a target='_blank' rel='noreferrer'>
            <div className='group absolute right-2 bottom-2 cursor-pointer rounded-sm border border-white bg-[rgba(0,0,0,.2)] px-1.5 text-xs text-white dark:border-gray-500 dark:text-gray-500'>
              <span className='group-hover:hidden'>广告</span>
              <span className='hidden group-hover:inline'>投放广告</span>
            </div>
          </a>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}
