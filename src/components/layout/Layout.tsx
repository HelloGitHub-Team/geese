import { useRouter } from 'next/router';
import { ReactNode, useMemo } from 'react';

import Header from '@/components/layout/Header';
import { Side } from '@/components/side/Side';

import TagList from '../side/TagList';

export default function Layout({ children }: { children: ReactNode }) {
  // Put Header or Footer Here
  const router = useRouter();
  const { pathname } = router;

  const showIndexSide = useMemo<boolean>(() => {
    // 不需要展示右边栏的路由
    const singlePage: string[] = [
      '/help/ats',
      '/help/rule',
      '/periodical/volume/[id]',
    ];
    return singlePage.includes(pathname);
  }, [pathname]);

  return (
    <>
      <Header />
      <main className='container mx-auto px-0 pt-14 xl:px-40 2xl:px-56'>
        {showIndexSide ? (
          <div>{children}</div>
        ) : (
          <div className='flex shrink grow flex-row sm:border-l md:border-none'>
            {pathname == '/' ? (
              <>
                <TagList />
                <div className='relative w-0 shrink grow lg:w-7/12 lg:grow-0'>
                  {children}
                </div>
              </>
            ) : (
              <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
                {children}
              </div>
            )}
            <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
              {pathname == '/' ? <Side index={true} /> : <Side index={false} />}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
