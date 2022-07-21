import { NextPage } from 'next';
import { useRouter } from 'next/router';

import ImageWithPreview from '@/components/ImageWithPreview';
import MDRender from '@/components/mdRender/MDRender';
import Pagination from '@/components/pagination/Pagination';
import Seo from '@/components/Seo';

import { getVolume, getVolumeNum } from '@/services/volume';

import { Fork, LinkTo, Star, Watch } from './icon';

import {
  PeriodicalPageProps,
  VolumeCategory,
  VolumeItem,
} from '@/types/volume';

const PeriodicalPage: NextPage<PeriodicalPageProps> = ({ volume, total }) => {
  const router = useRouter();
  const categoryList: VolumeCategory[] = volume?.data || [];
  const { current_num } = volume;
  const onPageChange = (page: number) => {
    console.log(page);
    router.push(`/periodical/volume/${page}`);
  };
  const onClickLink = (item: VolumeItem) => {
    console.log(item);
    // window.open(item.github_url);
  };
  const allItems = categoryList
    .reduce((acc, category) => {
      return acc.concat(category.items);
    }, [])
    .map((item) => item.rid);
  const itemIndex = (item: VolumeItem) => {
    return allItems.indexOf(item.rid) + 1;
  };
  return (
    <div className='relative pb-12'>
      <Seo title={`HelloGitHub 第 ${current_num} 期`} />
      <div className='mt-5 flex flex-col items-center'>
        <h1 className='mb-2 font-medium text-gray-700'>第 {current_num} 期</h1>
        <h2 className='font-normal text-gray-400'>
          兴趣是最好的老师，HelloGitHub 的使命就是帮你找到编程的兴趣。
        </h2>
      </div>
      <div className='my-8 max-h-screen overflow-y-auto bg-white p-5'>
        {categoryList?.map((category: VolumeCategory, _cIndex: number) => {
          const id = `category-${category.category_id}`;
          return (
            <div key={category.category_id} className='pb-10'>
              <h1 id={id} className='text-gray-600'>
                {category.category_name}
              </h1>
              {category.items.map((item: VolumeItem, index: number) => {
                return (
                  <div key={item.rid} className='mt-4'>
                    <div className='mt-8 mb-4 inline-flex gap-2'>
                      <a id={item.name} href={`#${item.name}`}>
                        <LinkTo />
                      </a>
                      <span>{itemIndex(item)}.</span>
                      <a
                        href={item.github_url}
                        target='_blank'
                        onClick={() => onClickLink(item)}
                        className=' text-blue-600'
                        rel='noreferrer'
                      >
                        <span>{item.name}</span>
                      </a>
                    </div>
                    {/* stars forks watch */}
                    <div className='mb-4 flex'>
                      <span className='mr-2 flex text-gray-600'>
                        <Star /> Star {item.stars}
                      </span>
                      <span className='mr-2 flex text-gray-600'>
                        <Fork />
                        Fork {item.forks}
                      </span>
                      <span className='flex text-gray-600'>
                        <Watch />
                        Watch {item.watch}
                      </span>
                    </div>
                    <MDRender>{item.description}</MDRender>
                    {item.image_url && (
                      <ImageWithPreview
                        src={item.image_url}
                        className='rounded-lg'
                        alt={item.name}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* 右侧目录 */}
      <div className='fixed top-48 right-80 bg-white p-4'>
        <ul className='list-inside list-disc'>
          {categoryList?.map((category, cIndex: number) => {
            const id = `#category-${category.category_id}`;
            return (
              <li key={cIndex} className='list-item'>
                <a
                  // href={id}
                  className='text-blue-700'
                  onClick={() => {
                    document.querySelector(id).scrollIntoView();
                  }}
                >
                  {category.category_name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <Pagination
        total={total}
        current={current_num}
        onChange={onPageChange}
      ></Pagination>
    </div>
  );
};

export default PeriodicalPage;

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取月刊的总期数
  const total = await getVolumeNum();
  const posts = new Array(total).fill(0).map((_, i) => ({ id: String(i + 1) }));

  // 根据博文列表生成所有需要预渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// 在构建时也会被调用
export async function getStaticProps({ params }: any) {
  // params 包含此片博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const volume = await getVolume(params.id);
  const total = await getVolumeNum();

  // 通过 props 参数向页面传递博文的数据
  return { props: { volume, total } };
}
