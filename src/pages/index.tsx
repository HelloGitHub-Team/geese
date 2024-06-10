import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useLoginContext } from '@/hooks/useLoginContext';
import useRepositories from '@/hooks/useRepositories';

import ItemBottom from '@/components/home/ItemBottom';
import Items from '@/components/home/Items';
import Loading from '@/components/loading/Loading';
import { HomeSkeleton } from '@/components/loading/skeleton';
import IndexBar from '@/components/navbar/IndexBar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

const Index: NextPage = () => {
  const router = useRouter();
  const { sort_by = 'featured', tid = '' } = router.query;

  const { isLogin } = useLoginContext();
  const { repositories, isValidating, hasMore, size, sentryRef } =
    useRepositories(sort_by as string, tid as string);

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      return (
        <ItemBottom
          endText={
            isLogin ? '你不经意间触碰到了底线' : '到底啦！登录可查看更多内容'
          }
        />
      );
    }
    return null;
  };

  return (
    <>
      <Seo title='首页' description='分享 GitHub 上有趣、入门级的开源项目' />
      <IndexBar tid={tid as string} sort_by={sort_by as string} />
      <div className='h-screen'>
        <Items repositories={repositories} />
        <div
          className='divide-y divide-gray-100 overflow-hidden dark:divide-gray-700'
          ref={sentryRef}
        >
          {isValidating && size <= 1 && <HomeSkeleton loop={6} />}
          {(isValidating || hasMore) && size > 1 && <Loading />}
        </div>
        {handleItemBottom()}
        <div className='hidden border-none md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export default Index;
