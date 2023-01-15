import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import Navbar from '@/components/navbar/Navbar';
import Pagination from '@/components/pagination/Pagination';
import PeriodItem from '@/components/periodical/item';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getCategory } from '@/services/category';

import { CategoryPageProps, PeriodicalItem } from '@/types/periodical';

const PeriodicalCategoryPage: NextPage<CategoryPageProps> = ({ category }) => {
  const router = useRouter();

  // 项目列表
  const allItems: PeriodicalItem[] = useMemo(() => {
    return category?.data || [];
  }, [category]);

  const onPageChange = (page: number) => {
    const name = category?.category_name;
    router.push(
      `/periodical/category/${encodeURIComponent(name)}?page=${page}`
    );
  };

  if (router.isFallback) {
    return (
      <div className='mt-20 flex animate-pulse'>
        <Seo title='月刊' />
        <div className='ml-4 mt-2 w-full'>
          <h3 className='h-4 rounded-md bg-gray-200'></h3>

          <ul className='mt-5 space-y-3'>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
            <li className='h-4 w-full rounded-md bg-gray-200'></li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={`HelloGitHub｜${category?.category_name}`} />
      <div className='relative pb-6'>
        <Navbar middleText={category?.category_name} endText='分类'></Navbar>

        <div className='my-2 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='text-normal mb-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
            <div className='whitespace-pre-wrap rounded-lg border bg-white p-2 font-normal leading-8 text-gray-500 dark:bg-gray-800 dark:text-gray-300'>
              <p>
                这里是按照「<span className='font-bold'>分类</span>」阅读往期的
                HelloGitHub 月刊内容， 您目前在查看
                <span className='font-bold'>
                  {' '}
                  HelloGitHub {`${category?.category_name}`}
                </span>{' '}
                集合。
              </p>
            </div>
          </div>

          {allItems?.map((item: PeriodicalItem, index: number) => {
            return <PeriodItem key={index} item={item} index={index} />;
          })}
        </div>

        <Pagination
          total={category?.page_total}
          current={category?.current_page}
          onPageChange={onPageChange}
          PreviousText='上一页'
          NextText='下一页'
        />
      </div>
      <ToTop />
    </>
  );
};

export default PeriodicalCategoryPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
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

  const name = query['name'] as string;
  const data = await getCategory(
    ip,
    encodeURIComponent(name),
    query['page'] as unknown as number
  );
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        category: data,
      },
    };
  }
};
