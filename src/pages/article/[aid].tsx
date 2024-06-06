import { GetServerSideProps, NextPage } from 'next';

import ItemBottom from '@/components/home/ItemBottom';
import ImageWithPreview from '@/components/ImageWithPreview';
import { MDRender } from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getArticleContent } from '@/services/article';

import { ArticleProps } from '@/types/article';

const ArticlePage: NextPage<ArticleProps> = ({ article }) => {
  return (
    <>
      <Seo title={article.title} />
      <Navbar middleText={article.title} endText='文章'></Navbar>

      <div className='mt-2 bg-white py-0.5 px-5 dark:bg-gray-800 md:rounded-lg '>
        <article className='relative'>
          <MDRender className='mobile:prose-sm prose prose-blue max-w-none dark:prose-invert'>
            {article.content}
          </MDRender>
        </article>
        <div className='my-2 flex justify-center'>
          <ImageWithPreview
            className='hidden cursor-zoom-in rounded-lg md:block'
            src='https://img.hellogithub.com/ad/footer.png'
            alt='weixin_footer'
          />
        </div>
        <ItemBottom endText='END'></ItemBottom>
        <ToTop />
      </div>
      <div className='h-4'></div>
    </>
  );
};

export default ArticlePage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const aid = query?.aid as string;
  const data = await getArticleContent(ip, aid);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: { article: data.data },
    };
  }
};
