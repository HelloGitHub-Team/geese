import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

const Footer = () => {
  return (
    <footer className='text-color-secondary flex flex-col flex-wrap px-3 py-2.5 text-sm'>
      <p>
        <Link href='/help/tos'>
          <span className='mr-2 hover:underline'>服务协议</span>
        </Link>
        <Link href='/help/syntax'>
          <span className='hover:underline'>Markdown</span>
        </Link>
      </p>
      <Link target='_blank' href='https://beian.miit.gov.cn/'>
        <span className='mt-1 hover:underline'>京 ICP 备 17046648-1 号</span>
      </Link>
      <Link target='_blank' href='https://www.beian.gov.cn/portal/recordQuery'>
        <span className='mt-1 hover:underline'>
          <Image
            src='https://img.hellogithub.com/ad/filing.png'
            width='12'
            height='12'
            alt='filing'
          />
          京公网安备 11010802023873 号
        </span>
      </Link>
      <span className='mt-1'>© 2022 HelloGitHub</span>
    </footer>
  );
};

export default Footer;
