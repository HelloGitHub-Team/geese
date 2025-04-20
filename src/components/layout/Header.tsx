import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';

import { useLoginContext } from '@/hooks/useLoginContext';
import { useSponsor } from '@/hooks/useSponsor';

import HeaderBtn from '@/components/buttons/HeaderBtn';
import LanguageSwitcher from '@/components/buttons/LanguageSwitcher';
import RankButton from '@/components/buttons/RankButton';
import ThemeSwitcher from '@/components/buttons/ThemeSwitcher';
import { RepoModal } from '@/components/dialog/RepoModal';
import AvatarWithDropdown from '@/components/dropdown/AvatarWithDropdown';

import TopBanner from './TopBanner';
import { LoginButton } from '../buttons/LoginButton';
import SearchInput from '../search/SearchInput';

interface Props {
  hiddenAd: () => void;
  showAd: () => void;
}

const Header = ({ hiddenAd, showAd }: Props) => {
  const router = useRouter();
  const { isLogin } = useLoginContext();
  const [curPath, setCurPath] = useState('');
  const { t, i18n } = useTranslation('common');
  const [_, setHasHeaderAd] = useState(false);
  const { topAd } = useSponsor();

  const handleCloseAd = () => {
    hiddenAd();
    setHasHeaderAd(false);
  };

  useEffect(() => {
    if (topAd) {
      if (localStorage.adClosed === topAd.aid) {
        setHasHeaderAd(false);
      } else {
        showAd();
        setHasHeaderAd(true);
      }
    } else {
      setHasHeaderAd(false);
    }
  }, [topAd, showAd]);

  useEffect(() => {
    setCurPath(router.pathname);
  }, [router.pathname]);

  const liClassName = (path: string) =>
    classNames(
      'hidden md:block hover:font-bold hover:text-gray-700 dark:hover:text-gray-100 hover:border-b-2 hover:border-blue-500 h-12',
      {
        'text-blue-500':
          curPath.startsWith(path) && (path !== '/' || curPath === path),
        'text-gray-500 dark:text-gray-300': !(
          curPath.startsWith(path) &&
          (path !== '/' || curPath === path)
        ),
      }
    );

  return (
    <div className='fixed z-10 w-full bg-white shadow-sm backdrop-blur dark:border dark:border-gray-50/[0.06] dark:bg-transparent'>
      {topAd && (
        <TopBanner
          i18n_lang={i18n.language}
          data={topAd}
          onClose={handleCloseAd}
        />
      )}
      <nav className='mx-auto flex max-w-5xl items-center justify-between px-2 py-2 md:py-0 lg:px-0 xl:max-w-5xl 2xl:max-w-7xl'>
        {/* pc 端显示的 logo */}
        <span className='hidden py-2 md:block'>
          <img
            className='cursor-pointer hover:animate-spin dark:invert'
            src='https://img.hellogithub.com/logo/logo.png'
            width='28'
            height='28'
            alt='HelloGitHub_logo'
            onClick={() => {
              router.push('/');
            }}
          />
        </span>
        {/* 移动端显示的[排行榜]等按钮的下拉列表 */}
        <div className='md:hidden'>
          <RankButton type='dropdown' t={t} />
        </div>
        <SearchInput t={t} />
        <ul className='text-md ml-5 flex items-center space-x-2 font-medium text-gray-500 dark:text-gray-400 md:pt-2'>
          {/* pc 端显示的顶部按钮 */}
          <li className={liClassName('/')}>
            <HeaderBtn pathname='/'>{t('header.home')}</HeaderBtn>
          </li>
          <li className={liClassName('/periodical')}>
            <HeaderBtn pathname='/periodical'>
              {t('header.periodical')}
            </HeaderBtn>
          </li>
          <li className={liClassName('/report/tiobe')}>
            <RankButton t={t} />
          </li>
          <li className={liClassName('/article')}>
            <HeaderBtn pathname='/article'>{t('header.article')}</HeaderBtn>
          </li>
          {/* 移动端显示的登录按钮和头像 */}
          <li className='block md:hidden'>
            {!isLogin ? <LoginButton t={t} /> : <AvatarWithDropdown t={t} />}
          </li>
        </ul>
        <div className='shrink grow' />
        <div className='hidden cursor-pointer items-center space-x-1 md:flex'>
          <RepoModal>
            <button className='flex h-8 cursor-pointer items-center rounded-lg border border-transparent bg-blue-500 px-2 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 dark:border-gray-500 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 lg:mr-1'>
              <AiOutlineGithub size={16} className='mr-0.5' />
              {t('header.submit')}
            </button>
          </RepoModal>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  );
};

export default Header;
