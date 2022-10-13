import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Suspense, useMemo } from 'react';

import Header from '@/components/layout/Header';
import Loading from '@/components/loading/Loading';

// 延迟加载，提高首次渲染速度
const IndexSide = dynamic(() => import('../side/IndexSide'), {
  suspense: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const router = useRouter();
  const showIndexSide = useMemo<boolean>(() => {
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
      <main className='container mx-auto px-0 pt-14 xl:px-40'>
        {showIndexSide ? (
          <div>{children}</div>
        ) : (
          <div className='flex shrink grow flex-row sm:border-l md:border-none'>
            <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
              {children}
            </div>
            <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
              <Suspense fallback={<Loading />}>
                <IndexSide />
              </Suspense>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
