import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

interface Props {
  id: string;
  image: string;
  url: string;
  className?: string;
}

export default function Ad(props: Props) {
  const [visible, setVisible] = useState(false);
  const route = useRouter();
  const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    localStorage.setItem(props.id, 'true');
    setVisible(false);
  };
  const handleAd: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    // TODO: 投放广告跳转的地址
    route.push(props.url);
  };

  useEffect(() => {
    const isHide = localStorage.getItem(props.id);
    setVisible(!isHide);
  }, [props.id, setVisible]);

  return (
    <Link href={props.url} target='_blank'>
      <div
        className={`${props.className} relative h-20 cursor-pointer rounded-lg bg-white`}
        hidden={!visible}
      >
        <div className='group relative h-full'>
          <Image
            className='object-contain'
            layout='fill'
            src={props.image}
            alt='广告'
          />
          <div
            className='absolute top-0 right-0 hidden cursor-pointer p-1.5 text-black opacity-30 group-hover:block'
            onClick={handleClose}
          >
            <VscClose size={20} />
          </div>
        </div>
        <div
          className='group absolute right-2 bottom-2 cursor-pointer rounded-sm border border-white bg-[rgba(0,0,0,.2)] px-2 text-xs text-white'
          onClick={handleAd}
        >
          <span className='group-hover:hidden'>广告</span>
          <span className='hidden group-hover:inline'>投放广告</span>
        </div>
      </div>
    </Link>
  );
}
