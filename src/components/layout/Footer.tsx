import { AiFillWechat, AiFillWeiboCircle } from 'react-icons/ai';
import { IoLogoRss } from 'react-icons/io';

import CustomLink from '@/components/links/CustomLink';

const Footer = () => {
  return (
    <footer className='flex flex-wrap items-center px-1 py-2.5 text-xs text-gray-400 lg:px-3'>
      <p>
        <CustomLink className='inline' href='/help/rule'>
          <span className='cursor-pointer hover:text-blue-500'>社区玩法</span>
        </CustomLink>
        <span className='px-1 lg:px-1.5'>·</span>
        <CustomLink className='inline' href='/server-sitemap-index.xml'>
          <span className='cursor-pointer hover:text-blue-500'>站点地图</span>
        </CustomLink>
        <span className='px-1 lg:px-1.5'>·</span>
        <CustomLink className='inline' href='/help/ats'>
          <span className='cursor-pointer hover:text-blue-500'>服务协议</span>
        </CustomLink>
      </p>
      <p className='mt-2'>
        <a
          target='_blank'
          className='cursor-pointer hover:text-blue-500'
          href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
          rel='noreferrer'
        >
          <span>建议反馈</span>
        </a>
        <span className='px-1 lg:px-1.5'>·</span>

        <a
          target='_blank'
          className='cursor-pointer hover:text-blue-500'
          href='https://github.com/HelloGitHub-Team/geese'
          rel='noreferrer'
        >
          <span>贡献代码</span>
        </a>
        <span className='px-1 lg:px-1.5'>·</span>
        <a
          className='cursor-pointer hover:text-blue-500'
          href='mailto:595666367@qq.com'
        >
          联系我们
        </a>
      </p>
      <a
        target='_blank'
        href='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'
        rel='noreferrer'
      >
        <div className='mt-2 cursor-pointer hover:text-blue-500'>
          <span>服务器由</span>
          <span className='mx-0.5 align-[1px]'>
            <img
              className='inline-block'
              src='https://img.hellogithub.com/ad/ucloud_footer.png'
              width='86'
              height='16'
              alt='ucloud_footer'
            />
          </span>
          <span>提供</span>
        </div>
      </a>
      <a
        className='block'
        target='_blank'
        href='https://www.upyun.com/league?utm_source=HelloGitHub&utm_medium=adting'
        rel='noreferrer'
      >
        <div className='mt-2 cursor-pointer hover:text-blue-500'>
          <span>专业的</span>
          <span className='mx-0.5 align-[1px]'>
            <img
              className='inline-block'
              src='https://img.hellogithub.com/ad/upyun_footer.png'
              width='42'
              height='16'
              alt='upyun_footer'
            />
          </span>
          <span>提供云存储服务</span>
        </div>
      </a>

      <a
        className='mt-2 block cursor-pointer hover:text-blue-500'
        target='_blank'
        href='https://beian.miit.gov.cn/'
        rel='noreferrer'
      >
        <span>京ICP备17046648号-1</span>
      </a>
      <a
        className='mt-2 block cursor-pointer hover:text-blue-500'
        target='_blank'
        href='http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011402013237'
        rel='noreferrer'
      >
        <span>
          <img
            className='inline-block'
            src='https://img.hellogithub.com/ad/filing.png'
            width='12'
            height='12'
            alt='footer_filing'
          />
          京公网安备11011402013237号
        </span>
      </a>
      <p className='mt-2'>
        <span className='cursor-default'>©2023 HelloGitHub</span>
        <span className='px-1 lg:px-1.5'>·</span>
        <span className='inline-block cursor-pointer align-[-2px] hover:text-green-500'>
          <a
            target='_blank'
            href='https://img.hellogithub.com/ad/weixin_footer.png'
            rel='noreferrer'
          >
            <AiFillWechat size={14} />
          </a>
        </span>
        <span className='px-0.5 lg:px-1'></span>
        <span className='inline-block cursor-pointer align-[-2px] hover:text-red-500'>
          <a
            target='_blank'
            href='https://weibo.com/hellogithub'
            rel='noreferrer'
          >
            <AiFillWeiboCircle size={14} />
          </a>
        </span>
        <span className='px-0.5 lg:px-1'></span>
        <span className='inline-block cursor-pointer align-[-2px] hover:text-orange-500'>
          <a
            target='_blank'
            href='https://hellogithub.com/rss'
            rel='noreferrer'
          >
            <IoLogoRss size={14} />
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
