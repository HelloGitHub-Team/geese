import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ItemBottom from '@/components/home/ItemBottom';
import ImageWithPreview from '@/components/ImageWithPreview';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getArticleContent } from '@/services/article';
import { getClientIP } from '@/utils/util';

import { ArticleProps } from '@/types/article';

const ArticlePage: NextPage<ArticleProps> = ({ article }) => {
  const { t, i18n } = useTranslation('article');

  return (
    <>
      <Seo title={article.title} description={article.desc} />
      <Navbar middleText={article.title} endText={t('nav.title')} />
      <div className='mt-2 bg-white py-0.5 px-5 dark:bg-gray-800 md:rounded-lg'>
        <article className='relative'>
          <MDRender className='mobile:prose-sm prose prose-blue max-w-none dark:prose-invert'>
            {article.content}
          </MDRender>
        </article>
        {i18n.language === 'zh' ? (
          <div className='my-2 flex justify-center'>
            <ImageWithPreview
              className='hidden cursor-zoom-in rounded-lg md:block'
              src='https://img.hellogithub.com/ad/footer.png'
              alt='weixin_footer'
            />
          </div>
        ) : (
          <a
            href='https://www.buymeacoffee.com/hellogithub'
            className='flex justify-center'
            target='_blank'
            rel='noreferrer'
          >
            <img
              src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'
              alt='Buy Me A Coffee'
              className='h-[60px] w-[217px]'
            />
          </a>
        )}

        <ItemBottom endText='END' />
        <ToTop />
      </div>
      <div className='h-4' />
    </>
  );
};

export default ArticlePage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale,
}) => {
  const ip = getClientIP(req);
  const aid = query?.aid as string;
  const data = await getArticleContent(ip, aid, locale as string);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        article: data.data,
        ...(await serverSideTranslations(locale as string, [
          'common',
          'article',
        ])),
      },
    };
  }
};
