import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

const Footer = () => {
  return (
    <footer className='flex flex-wrap px-3 py-2.5 text-xs text-slate-400'>
      <p>
        <Link href='/help/rule'>
          <span className='cursor-pointer  hover:underline'>社区玩法</span>
        </Link>
        <span className='pl-1 pr-1'>·</span>
        <a
          target='_blank'
          className='cursor-pointer  hover:underline'
          href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
          rel='noreferrer'
        >
          <span>建议反馈</span>
        </a>
        <span className='pl-1 pr-1'>·</span>
        <Link href='/help/ats'>
          <span className='cursor-pointer  hover:underline'>服务协议</span>
        </Link>
      </p>
      <a
        target='_blank'
        href='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'
        rel='noreferrer'
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
      </a>
      <a
        className='block'
        target='_blank'
        href='https://www.upyun.com/'
        rel='noreferrer'
      >
        <div className='mt-2 flex cursor-pointer hover:underline'>
          <div className='mr-1 align-text-bottom'>专业的</div>
          <Image
            src='https://img.hellogithub.com/ad/upyun.png'
            width='36'
            height='18'
            alt='upyun'
          />
          <div className='ml-1 align-text-bottom'>提供云存储服务</div>
        </div>
      </a>

      <a
        className='mt-2 block cursor-pointer hover:underline'
        target='_blank'
        href='https://beian.miit.gov.cn/'
        rel='noreferrer'
      >
        <span>京 ICP 备 17046648-1 号</span>
      </a>
      <a
        className='mt-2 block cursor-pointer hover:underline'
        target='_blank'
        href='https://www.beian.gov.cn/portal/recordQuery'
        rel='noreferrer'
      >
        <span>
          <Image
            src='https://img.hellogithub.com/ad/filing.png'
            width='12'
            height='12'
            alt='filing'
          />
          京公网安备 11010802023873 号
        </span>
      </a>
      <p className='mt-2'>
        <span>©2022 HelloGitHub</span>
        <span className='pl-1 pr-1'>·</span>
        <a
          className='cursor-pointer hover:underline'
          href='mailto:595666367@qq.com'
        >
          联系我们
        </a>
      </p>
    </footer>
  );
};

export default Footer;
