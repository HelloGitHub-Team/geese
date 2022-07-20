import { NextPage } from 'next';

import ImageWithPreview from '@/components/ImageWithPreview';
import MDRender from '@/components/mdRender/MDRender';
import Seo from '@/components/Seo';

import { getVolume } from '@/services/volume';

import {
  PeriodicalPageProps,
  VolumeCategory,
  VolumeItem,
} from '@/types/volume';

const PeriodicalPage: NextPage<PeriodicalPageProps> = ({ volume }) => {
  const categoryList: VolumeCategory[] = volume?.data || [];

  return (
    <div className='mt-4'>
      <Seo title={`开源项目 ${volume.current_num}`} />
      <Seo />
      {categoryList?.map((category: VolumeCategory, _cIndex: number) => {
        const id = `category-${category.category_id}`;
        return (
          <div key={category.category_id} className='pt-10'>
            <h1 id={id} className='text-gray-600'>
              {category.category_name}
            </h1>
            {category.items.map((item: VolumeItem, index: number) => {
              return (
                <div key={item.rid} className='mt-4'>
                  <h4>
                    <span>{index + 1} - </span>
                    {item.name}
                  </h4>
                  <MDRender>{item.description}</MDRender>
                  <ImageWithPreview
                    src={item?.image_url}
                    className='rounded-lg'
                    alt={item.name}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      ;
      <div className='fixed left-10 top-40'>
        <ul className='list-disc'>
          {categoryList?.map((category, cIndex: number) => {
            const id = `#category-${category.category_id}`;
            return (
              <li key={cIndex} className='list-item'>
                <a href={id} className='text-blue-700'>
                  {category.category_name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PeriodicalPage;

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取博文列表
  // const res = await fetch('https://.../posts');
  const posts = new Array(75).fill(0).map((_, i) => ({ id: String(i + 1) }));

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

  // 通过 props 参数向页面传递博文的数据
  return { props: { volume } };
}
