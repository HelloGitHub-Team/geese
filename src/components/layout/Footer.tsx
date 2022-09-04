import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

const Footer = () => {
  return (
    <footer className='flex flex-wrap px-3 py-2.5 text-xs text-slate-400'>
      <p>
        <Link href='/help/syntax'>
          <span className='cursor-pointer  hover:underline'>社区玩法</span>
        </Link>
        <span className='pl-1 pr-1'>·</span>
        <Link href='/help/syntax'>
          <span className='cursor-pointer  hover:underline'>建议反馈</span>
        </Link>
        <span className='pl-1 pr-1'>·</span>
        <Link href='/help/tos'>
          <span className='cursor-pointer  hover:underline'>服务协议</span>
        </Link>
      </p>

      <Link
        target='_blank'
        href='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'
      >
        <div className='mt-2 cursor-pointer hover:underline'>
          <span>本站服务器由</span>
          <span className='mx-1 align-[-3px]'>
            <Image
              className='object-contain'
              src='https://img.hellogithub.com/ad/ucloud.png'
              width='86'
              height='16'
              alt='ucloud'
            />
          </span>
          <span>提供</span>
        </div>
      </Link>

      <Link target='_blank' href='https://www.upyun.com/'>
        <div className='mt-2 cursor-pointer hover:underline'>
          <span>专业的</span>
          <span className='mx-1 align-[-4px]'>
            <Image
              className='object-contain'
              src='https://img.hellogithub.com/ad/upyun.png'
              width='48'
              height='18'
              alt='upyun'
            />
          </span>
          <span>提供云存储服务</span>
        </div>
      </Link>

      <Link target='_blank' href='https://beian.miit.gov.cn/'>
        <span className='mt-2 cursor-pointer hover:underline'>
          京 ICP 备 17046648-1 号
        </span>
      </Link>
      <Link target='_blank' href='https://www.beian.gov.cn/portal/recordQuery'>
        <span className='mt-2 cursor-pointer hover:underline'>
          <Image
            src='https://img.hellogithub.com/ad/filing.png'
            width='12'
            height='12'
            alt='filing'
          />
          京公网安备 11010802023873 号
        </span>
      </Link>
      <span className='mt-2'>©2022 HelloGitHub</span>
    </footer>
  );
};

export default Footer;
