import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AiFillFire } from 'react-icons/ai';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import { useLoginContext } from '@/hooks/useLoginContext';

import ItemBottom from '@/components/home/ItemBottom';
import { NoPrefetchLink } from '@/components/links/CustomLink';
import Loading from '@/components/loading/Loading';
import { ArticleSkeleton } from '@/components/loading/skeleton';
import ArticleNavbar from '@/components/navbar/ArticleBar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { ArticleItem, ArticleItems } from '@/types/article';

const ArticleIndex: NextPage = () => {
  const { t, i18n } = useTranslation('article');

  const router = useRouter();
  const { sort_by = 'last' } = router.query;
  const { isLogin } = useLoginContext();

  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<ArticleItems>(
      (index) => makeUrl(`/article/`, { sort_by, page: index + 1 }),
      fetcher,
      { revalidateFirstPage: false }
    );

  const articles = data ? data.flatMap((page) => page.data) : [];

  const hasMore = data ? data[data.length - 1].has_more : false;

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => setSize((prevSize) => prevSize + 1),
    rootMargin: '0px 0px 100px 0px',
  });

  const handleItemBottom = () => {
    if (!isValidating && !hasMore) {
      const endText = isLogin
        ? t('bottom_text_login')
        : t('bottom_text_nologin');
      return <ItemBottom endText={endText} />;
    }
  };

  return (
    <>
      <Seo title={t('title')} description={t('description')} />
      <ArticleNavbar t={t} />
      <div className='h-screen'>
        <div className='divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800 md:overflow-y-hidden md:rounded-lg'>
          {articles.map((item: ArticleItem) => (
            <article key={item.aid}>
              <NoPrefetchLink href={`/article/${item.aid}`}>
                <a className='relative'>
                  <div className='text-color-primary relative cursor-pointer bg-white py-2 pl-3 pr-3 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:py-3 md:pl-5'>
                    <div className='relative flex items-center'>
                      <div className='w-9/12'>
                        <div className='flex items-center'>
                          {item.is_hot && (
                            <AiFillFire
                              className='mr-1 inline-block min-w-min align-[-2px]'
                              size={16}
                              style={{ color: 'rgb(226,17,12)' }}
                            />
                          )}
                          <span className='truncate pr-2 text-sm leading-snug md:pr-0 md:text-base'>
                            {i18n.language == 'en'
                              ? item.title_en || item.title
                              : item.title}
                          </span>
                        </div>
                        <div className='pt-1 pb-1.5 pr-1 text-xs leading-loose text-gray-400 line-clamp-2 md:pr-0'>
                          {i18n.language == 'en'
                            ? item.desc_en || item.desc
                            : item.desc}
                        </div>
                        <div className='flex items-center text-xs text-gray-800 dark:text-gray-200'>
                          <div className='truncate whitespace-nowrap md:max-w-xs'>
                            {t('author', { name: item.author })}
                          </div>
                          <span className='px-1'>·</span>
                          <time>{fromNow(item.publish_at, i18n.language)}</time>
                          <span className='px-1'>·</span>
                          {t('read', {
                            num: numFormat(item.clicks_count, 1, 10000),
                          })}
                        </div>
                      </div>
                      {item.head_image && (
                        <div className='relative flex w-3/12 justify-center'>
                          <img
                            className='h-20 rounded-md md:w-32'
                            src={`${item.head_image}!headimage`}
                            alt='article head'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </NoPrefetchLink>
            </article>
          ))}
        </div>
        {(isValidating || hasMore) && (
          <div
            className='divide-y divide-gray-100 overflow-hidden dark:divide-gray-700 md:rounded-lg'
            ref={sentryRef}
          >
            {isValidating && size <= 1 && <ArticleSkeleton />}
            {isValidating && size > 1 && <Loading />}
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'article'])),
    },
  };
}

export default ArticleIndex;
