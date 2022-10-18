import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { GoRepoForked } from 'react-icons/go';
import { IoIosStarOutline } from 'react-icons/io';
import { MdOutlineArticle, MdOutlineRemoveRedEye } from 'react-icons/md';

import ImageWithPreview from '@/components/ImageWithPreview';
import MDRender from '@/components/mdRender/MDRender';
import Navbar from '@/components/navbar/Navbar';
import Pagination from '@/components/pagination/Pagination';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getCategory } from '@/services/category';
import { recordGoGithub } from '@/services/repository';
import { numFormat } from '@/utils/util';

import { CategoryItem, CategoryPageProps } from '@/types/periodical';

const PeriodicalCategoryPage: NextPage<CategoryPageProps> = ({ category }) => {
  const router = useRouter();
  // 项目列表
  const allItems: CategoryItem[] = useMemo(() => {
    return category?.data || [];
  }, [category]);

  const onPageChange = (page: number) => {
    const name = category?.category_name;
    router.push(
      `/periodical/category/${encodeURIComponent(name)}?page=${page}`
    );
  };
  const onClickLink = (item: CategoryItem) => {
    // 调用接口记录链接点击信息
    recordGoGithub(item.rid);
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
      <Seo title={`${category?.category_name}`} />
      <div className='relative pb-6'>
        <Navbar middleText={category?.category_name} endText='分类'></Navbar>

        <div className='my-2 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='text-normal mb-4 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
            <div className='whitespace-pre-wrap rounded-lg border bg-white p-2 font-normal leading-8 text-gray-500 dark:bg-gray-800 dark:text-gray-300'>
              <p>
                <span className='font-bold'>HelloGitHub 月刊</span>
                专注于分享 GitHub 上有趣、入门级的开源项目，每月 28 号更新。
                这里的开源项目总能让人大开眼界，勾起你对开源的兴趣。
              </p>
              <p>
                兴趣是最好的老师，愿它能指引你找到
                <span className='font-bold'>「进入开源世界的钥匙」</span>。
              </p>
            </div>
          </div>

          {allItems?.map((item: CategoryItem, index: number) => {
            return (
              <div key={item.rid}>
                <div className='mt-3 mb-2 inline-flex gap-1 text-base font-medium'>
                  <span>{index + 1}.</span>
                  <a
                    href={item.github_url}
                    target='_blank'
                    onClick={() => onClickLink(item)}
                    className=' text-blue-600 hover:text-blue-500 active:text-blue-500'
                    rel='noreferrer'
                  >
                    <span>{item.name}</span>
                  </a>
                </div>
                {/* stars forks watch */}
                <div className='mb-2 flex text-sm text-gray-500 dark:text-gray-400'>
                  <span className='mr-2 flex items-center'>
                    <IoIosStarOutline size={15} />
                    Star {numFormat(item.stars, 1)}
                  </span>
                  <span className='mr-2 flex items-center'>
                    <GoRepoForked size={15} />
                    Fork {numFormat(item.forks, 1)}
                  </span>
                  <span className='mr-2 flex items-center'>
                    <MdOutlineRemoveRedEye size={15} />
                    Watch {numFormat(item.watch, 1)}
                  </span>
                  <Link href={`/periodical/volume/${item.volume_num}`}>
                    <span className='flex cursor-pointer items-center hover:text-blue-500 active:text-blue-500'>
                      <MdOutlineArticle size={15} />第 {item.volume_num} 期
                    </span>
                  </Link>
                </div>
                {/* markdown 内容渲染 */}
                <MDRender className='markdown-body'>
                  {item.description}
                </MDRender>
                {/* 图片预览 */}
                {item.image_url && (
                  <div className='my-2 flex justify-center'>
                    <ImageWithPreview
                      className='cursor-zoom-in rounded-lg'
                      src={item.image_url}
                      alt={item.name}
                    />
                  </div>
                )}
              </div>
            );
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
