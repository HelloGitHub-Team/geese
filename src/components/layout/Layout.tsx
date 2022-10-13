import { useRouter } from 'next/router';
import * as React from 'react';

import Header from '@/components/layout/Header';

import IndexSide from '../side/IndexSide';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const router = useRouter();
  const showIndexSide = React.useMemo<boolean>(() => {
    const { pathname } = router;
    // 不需要展示右边栏的路由
    const singlePage: string[] = [
      '/help/ats',
      '/help/rule',
      '/periodical/volume/[id]',
    ];
    return singlePage.includes(pathname);
  }, [router]);

  return (
    <>
      <Header />
      <main className='container mx-auto px-0 pt-14 xl:px-40 2xl:px-56'>
        {showIndexSide ? (
          <div>{children}</div>
        ) : (
          <div className='flex shrink grow flex-row sm:border-l md:border-none'>
            <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
              {children}
            </div>
            <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
              <IndexSide></IndexSide>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
