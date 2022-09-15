import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

import { PUTAdURL } from '@/utils/constants';

interface Props {
  id: string;
  image: string;
  url: string;
  className?: string;
}

export default function Ad(props: Props) {
  const [visible, setVisible] = useState(true);
  const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    // localStorage.setItem(props.id, 'true');
    setVisible(false);
  };

  // useEffect(() => {
  //   const isHide = localStorage.getItem(props.id);
  //   setVisible(!isHide);
  // }, [props.id, setVisible]);

  return (
    <div
      className={`${props.className} relative h-20 cursor-pointer overflow-hidden rounded-lg bg-white dark:bg-gray-800`}
      hidden={!visible}
    >
      <a href={props.url} target='_blank' rel='noreferrer'>
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
      </a>

      <a href={PUTAdURL} target='_blank' rel='noreferrer'>
        <div className='group absolute right-2 bottom-2 cursor-pointer rounded-sm border border-white bg-[rgba(0,0,0,.2)] px-1.5 text-xs text-white'>
          <span className='group-hover:hidden'>广告</span>
          <span className='hidden group-hover:inline'>投放广告</span>
        </div>
      </a>
    </div>
  );
}
