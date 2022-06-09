import Link from 'next/link';
import * as React from 'react';

const Footer = () => {
  return (
    <footer className='text-color-secondary flex flex-wrap px-3 py-2.5 text-xs'>
      <Link href='/help/tos'>
        <span className='hover:underline'>服务协议</span>
      </Link>
      <span className='pl-1 pr-1'></span>
      <Link href='/help/syntax'>
        <span className='hover:underline'>Markdown</span>
      </Link>
      <Link target='_blank' href='https://beian.miit.gov.cn/'>
        <span className='pt-1 pr-2 hover:underline'>京ICP备 17046648 号</span>
      </Link>
      <span className='pt-1'>© 2022 HelloGitHub</span>
    </footer>
  );
};

export default Footer;
