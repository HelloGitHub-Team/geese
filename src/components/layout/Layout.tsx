import { useRouter } from 'next/router';
import { ReactNode, useMemo } from 'react';

import Header from '@/components/layout/Header';
import { Side } from '@/components/side/Side';

import TagList from '../side/TagList';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const isSinglePage = useMemo(() => {
    const singlePageRoutes = [
      '/help/ats',
      '/help/rule',
      '/periodical/volume/[id]',
    ];
    return singlePageRoutes.includes(pathname);
  }, [pathname]);

  return (
    <>
      <Header />
      <main className='container mx-auto px-0 pt-14 xl:px-40 2xl:px-56'>
        {isSinglePage ? (
          <div>{children}</div>
        ) : (
          <div className='flex flex-row md:border-none'>
            {pathname === '/' && <TagList />}
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
              <Side isHome={pathname === '/'} />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Layout;
