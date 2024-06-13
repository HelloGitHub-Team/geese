import Link from 'next/link';
import { MouseEventHandler, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

import { redirectRecord } from '@/services/home';

import { AdvertItem } from '@/types/home';

interface Props {
  data: AdvertItem;
  className?: string;
}

interface RewardAdContentProps {
  data: AdvertItem;
}

interface ImageAdContentProps {
  data: AdvertItem;
  handleClose: MouseEventHandler<HTMLDivElement>;
}

const ImageAdContent = ({ data, handleClose }: ImageAdContentProps) => (
  <div className='group relative h-full'>
    <img className='h-full w-full' src={data.image_url} alt='ad' />
    <div
      className='absolute top-0 right-0 hidden cursor-pointer p-1.5 text-inherit opacity-30 group-hover:block'
      onClick={handleClose}
    >
      <VscClose size={20} />
    </div>
  </div>
);

export default function Ad({ data, className }: Props) {
  const [visible, setVisible] = useState(true);

  const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setVisible(false);
  };

  const onClickLink = (aid: string) => {
    redirectRecord('', aid, 'ad');
  };

  if (!visible) return null;

  const ProgressBar = ({ percent }: { percent: number }) => (
    <div className='flex h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
      <div
        className='flex flex-col justify-center overflow-hidden bg-blue-500'
        style={{ width: `${percent}%` }}
      />
    </div>
  );

  const AdTargetInfo = ({ data }: { data: AdvertItem }) => (
    <div className='mt-1.5 mb-1 text-xs text-gray-500'>
      <span>
        {data.year ? '距离下个目标还差' : '距离目标还差'}
        <strong className='mx-1'>{100 - data.percent}%</strong>
      </span>
      <ProgressBar percent={data.percent} />
    </div>
  );

  const AdServerInfo = ({ data }: { data: AdvertItem }) => (
    <div className='mt-1.5 mb-1 text-xs text-gray-500'>
      <span>
        服务器还剩<strong className='mx-1'>{data.day}</strong>天
      </span>
      <div className='relative left-0.5 bottom-1 inline-flex w-fit'>
        <span className='text-xs font-medium text-blue-500'>
          <span className='mr-[0.5px]'>+{data.year}</span>年
        </span>
      </div>
      <ProgressBar percent={data.percent} />
    </div>
  );

  const RewardAdDetail = ({ data }: { data: AdvertItem }) => (
    <>
      <div className='group-hover:hidden'>
        <AdServerInfo data={data} />
      </div>
      <div className='hidden group-hover:block'>
        <AdTargetInfo data={data} />
      </div>
    </>
  );

  const RewardAdContent = ({ data }: RewardAdContentProps) => (
    <div className='group flex flex-row p-3'>
      <img className='h-[55px] w-[55px]' src={data.image_url} alt='ad' />
      <div className='ml-3'>
        <div className='font-medium tracking-wider md:text-sm lg:w-[135px] lg:truncate lg:whitespace-nowrap lg:text-base'>
          微信扫码赞助本站
        </div>
        <div className='hidden lg:block'>
          <RewardAdDetail data={data} />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`relative h-20 overflow-hidden rounded-lg bg-white dark:bg-gray-800 ${className}`}
    >
      <Link href={data.url}>
        <a
          target='_blank'
          onClick={() => onClickLink(data.aid)}
          rel='noreferrer'
        >
          {data.is_reward ? (
            <RewardAdContent data={data} />
          ) : (
            <ImageAdContent data={data} handleClose={handleClose} />
          )}
        </a>
      </Link>
    </div>
  );
}
