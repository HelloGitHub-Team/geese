import Link from 'next/link';
import { MouseEventHandler, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

import { recordGoAdvert, redirectRecord } from '@/services/home';
import { PUTAdURL } from '@/utils/constants';

interface Props {
  id: string;
  image: string;
  url: string;
  is_ad: boolean;
  className?: string;
}

export default function Ad(props: Props) {
  const [visible, setVisible] = useState(true);
  const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    // localStorage.setItem(props.id, 'true');
    setVisible(false);
  };

  const onClickLink = (aid: string) => {
    recordGoAdvert(aid);
    redirectRecord('', aid, 'ad');
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
      <Link href={props.url}>
        <a
          target='_blank'
          onClick={() => onClickLink(props.id)}
          rel='noreferrer'
        >
          <div className='group relative h-full'>
            <img className='h-full w-full' src={props.image} alt='ad' />
            <div
              className='absolute top-0 right-0 hidden cursor-pointer p-1.5 text-inherit opacity-30 group-hover:block'
              onClick={handleClose}
            >
              <VscClose size={20} />
            </div>
          </div>
        </a>
      </Link>

      {props.is_ad ? (
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
