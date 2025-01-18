import { useRouter } from 'next/router';
import { ReactNode, useMemo, useState } from 'react';

import Header from '@/components/layout/Header';
import { Side } from '@/components/side/Side';
import TagList from '@/components/side/TagList';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;
  const [showHeaderAd, setShowHeaderAd] = useState(false);

  const handleShowAd = () => {
    setShowHeaderAd(true);
  };

  const handleColseAd = () => {
    setShowHeaderAd(false);
  };

  const isSinglePage = useMemo(() => {
    const singlePageRoutes = [
      '/help/ats',
      '/help/rule',
      '/periodical/volume/[id]',
    ];
    return singlePageRoutes.includes(pathname);
  }, [pathname]);

  const ptValue = showHeaderAd ? '5.5rem' : '3.5rem';
  const topValue = showHeaderAd ? '6rem' : '4rem';

  return (
    <>
      <Header hiddenAd={handleColseAd} showAd={handleShowAd} />
      <main
        className='container mx-auto px-0 xl:px-40 2xl:px-56'
        style={{ paddingTop: ptValue }}
      >
        {isSinglePage ? (
          <div>{children}</div>
        ) : (
          <div className='flex flex-row md:border-none'>
            {pathname === '/' && <TagList topValue={topValue} />}
            <div
              className={`relative ${
                pathname === '/'
                  ? 'w-0 flex-grow lg:w-7/12'
                  : 'w-0 flex-grow lg:w-9/12'
              }`}
            >
              {children}
            </div>
            <div className='relative hidden w-3/12 shrink-0 md:block'>
              <Side isHome={pathname === '/'} topValue={topValue} />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Layout;
