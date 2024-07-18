import { AiFillWechat, AiFillWeiboCircle } from 'react-icons/ai';
import { IoLogoRss } from 'react-icons/io';

import { FeedbackModal } from '@/components/dialog/Feedback';
import CustomLink from '@/components/links/CustomLink';

import FooterLink from './FooterLink';

import { SideProps } from '@/types/home';

const Footer = ({ t }: SideProps) => {
  return (
    <footer className='flex flex-wrap items-center px-1 py-2.5 text-xs text-gray-400 lg:px-3'>
      <div className='inline-flex space-x-1 lg:space-x-1.5'>
        <FeedbackModal feedbackType={2}>
          <div className='cursor-pointer hover:text-blue-500'>
            {t('footer.feedback')}
          </div>
        </FeedbackModal>
        <span>·</span>
        <FeedbackModal feedbackType={3}>
          <div className='cursor-pointer hover:text-blue-500'>
            {t('footer.business')}
          </div>
        </FeedbackModal>
        <span>·</span>
        <FooterLink href='mailto:595666367@qq.com'>
          {t('footer.contact')}
        </FooterLink>
      </div>

      <p className='mt-2'>
        <FooterLink href='https://hellogithub.com/help/ats'>
          {t('footer.agreement')}
        </FooterLink>
        <span className='px-1 lg:px-1.5'>·</span>
        <FooterLink href='https://github.com/HelloGitHub-Team/geese'>
          {t('footer.source')}
        </FooterLink>
        <span className='px-1 lg:px-1.5'>·</span>
        <CustomLink className='inline' href='/server-sitemap-index.xml'>
          <span className='cursor-pointer hover:text-blue-500'>
            {t('footer.sitemap')}
          </span>
        </CustomLink>
      </p>

      <FooterLink href='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'>
        <div className='mt-2'>
          <span>{t('footer.server_sponsor')}</span>
          <span className='mx-0.5 align-[1px]'>
            <img
              className='inline-block'
              src='https://img.hellogithub.com/ad/ucloud_footer.png'
              width='86'
              height='16'
              alt='ucloud_footer'
            />
          </span>
          <span>{t('footer.server_sponsor2')}</span>
        </div>
      </FooterLink>

      <FooterLink href='https://www.upyun.com/league?utm_source=HelloGitHub&utm_medium=adting'>
        <div className='mt-2'>
          <span>{t('footer.cdn_sponsor')}</span>
          <span className='mx-0.5 align-[1px]'>
            <img
              className='inline-block'
              src='https://img.hellogithub.com/ad/upyun_footer.png'
              width='42'
              height='16'
              alt='upyun_footer'
            />
          </span>
          <span>{t('footer.cdn_sponsor2')}</span>
        </div>
      </FooterLink>

      <FooterLink className='mt-2 block' href='https://beian.miit.gov.cn/'>
        <span>京ICP备17046648号-1</span>
      </FooterLink>

      <FooterLink
        className='mt-2 block'
        href='http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011402013237'
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
      </FooterLink>

      <p className='mt-2 flex items-center space-x-1 lg:space-x-1.5'>
        <span className='cursor-default'>
          ©{new Date().getFullYear()} HelloGitHub
        </span>
        <span>·</span>
        <FooterLink
          href='https://hellogithub.com/weixin_footer.png'
          className='hover:text-green-500'
        >
          <AiFillWechat size={14} />
        </FooterLink>
        <FooterLink
          href='https://weibo.com/hellogithub'
          className='hover:text-red-500'
        >
          <AiFillWeiboCircle size={14} />
        </FooterLink>
        <FooterLink
          href='https://hellogithub.com/rss'
          className='hover:text-orange-500'
        >
          <IoLogoRss size={14} />
        </FooterLink>
      </p>
    </footer>
  );
};

export default Footer;
