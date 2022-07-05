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
        <span className='mt-1 hover:underline'>京ICP备 17046648 号</span>
      </Link>
      <span className='mt-1'>© 2022 HelloGitHub</span>
    </footer>
  );
};

export default Footer;
