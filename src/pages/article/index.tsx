import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillFire } from 'react-icons/ai';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { useLoginContext } from '@/hooks/useLoginContext';

import ItemBottom from '@/components/home/ItemBottom';
import Loading from '@/components/loading/Loading';
import ArticleNavbar from '@/components/navbar/ArticleBar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { ArticleItem, ArticleItems } from '@/types/article';

const ArticleIndex: NextPage = () => {
  const router = useRouter();
  const { sort_by = 'last' } = router.query;

  const { isLogin } = useLoginContext();
  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<ArticleItems>(
      (index) => makeUrl(`/article/`, { sort_by, page: index + 1 }),
      fetcher,
      { revalidateFirstPage: false }
    );

  const articles = data
    ? data.reduce((pre: ArticleItem[], curr) => {
        if (curr.data.length > 0) {
          pre.push(...curr.data);
        }
        return pre;
      }, [])
    : [];
  const hasMore = data ? data[data.length - 1].has_more : false;
  const pageIndex = data ? size : 0;

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => {
      setSize(pageIndex + 1);
    },
    rootMargin: '0px 0px 100px 0px',
  });

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      if (isLogin) {
        return <ItemBottom endText='你不经意间触碰到了底线'></ItemBottom>;
      } else {
        return <ItemBottom endText='到底啦！登录可查看更多内容'></ItemBottom>;
      }
    }
  };

  return (
    <>
      <Seo />
      <ArticleNavbar />
      <div className='h-screen'>
        <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
          {articles.map((item: ArticleItem) => (
            <article key={item.aid}>
              <Link href={`/article/${item.aid}`} className='relative'>
                <a>
                  <div className='relative cursor-pointer bg-white py-2 pl-3 pr-3 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 md:py-3 md:pl-5'>
                    <div className='flex-cloume relative flex items-center'>
                      <div className='w-9/12 max-w-full'>
                        <div className='text-color-primary flex visited:text-gray-500 dark:text-gray-300'>
                          {item.is_hot && (
                            <span className='text-center'>
                              <AiFillFire
                                className='mr-1 inline-block align-[-2px]'
                                size={16}
                                style={{ color: 'rgb(226,17,12)' }}
                              />
                            </span>
                          )}
                          <span className='truncate pr-2 text-sm leading-snug md:pr-0 md:text-base'>
                            {item.title}
                          </span>
                        </div>

                        <div className='pt-1 pb-1.5 pr-1 text-xs leading-loose text-gray-400 line-clamp-2 md:pr-0'>
                          {item.desc}
                        </div>
                        <div className='flex items-center'>
                          <div className='font-base flex shrink grow items-center overflow-x-hidden text-xs text-gray-800 dark:text-gray-200'>
                            <div className='hidden md:flex '>
                              <div className='truncate whitespace-nowrap md:max-w-xs'>
                                作者 {item.author}
                              </div>
                              <span className='px-1'>·</span>
                              <time>发布于 {fromNow(item.publish_at)}</time>
                              <span className='px-1'>·</span>
                              阅读 {numFormat(item.clicks_count, 1, 10000)}
                            </div>
                            <div className='flex md:hidden'>
                              <div className='w-fit truncate whitespace-nowrap'>
                                {item.author}
                              </div>
                              <span className='px-1'>·</span>
                              <time>{fromNow(item.publish_at)}</time>
                              <span className='px-1'>·</span>
                              {numFormat(item.clicks_count, 1, 10000)} 阅读
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='relative flex w-3/12 justify-center'>
                        {item.head_image ? (
                          <img
                            className='h-20 rounded-md md:w-32'
                            src={`${item.head_image}!headimage`}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </article>
          ))}
        </div>
        {(isValidating || hasMore) && (
          <div
            className='divide-y divide-gray-100 overflow-hidden dark:divide-gray-700'
            ref={sentryRef}
          >
            <Loading></Loading>
          </div>
        )}
        {handleItemBottom()}
        <div className='hidden border-none md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export default ArticleIndex;
