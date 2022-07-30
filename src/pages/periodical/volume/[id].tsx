import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

import ImageWithPreview from '@/components/ImageWithPreview';
import MDRender from '@/components/mdRender/MDRender';
import Pagination from '@/components/pagination/Pagination';
import Seo from '@/components/Seo';

import { getVolume, getVolumeNum } from '@/services/volume';

import { Fork, LinkTo, Star, ToTop, Watch } from './icon';

import {
  PeriodicalPageProps,
  VolumeCategory,
  VolumeItem,
} from '@/types/volume';

interface CategoryTopRange {
  id: string;
  start: number;
  end: number;
}

const PeriodicalPage: NextPage<PeriodicalPageProps> = ({ volume, total }) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('');
  // 月刊列表
  const categoryList: VolumeCategory[] = useMemo(() => {
    return volume?.data || [];
  }, [volume]);
  const { current_num } = volume;
  const onPageChange = (page: number) => {
    console.log(page);
    router.push(`/periodical/volume/${page}`);
  };
  const onClickLink = (item: VolumeItem) => {
    console.log(item);
    // window.open(item.github_url);
  };

  const allItems: string[] = categoryList
    .reduce((acc: any, category: any) => {
      return acc.concat(category.items);
    }, [])
    .map((item: VolumeItem) => item.rid);

  const itemIndex = (item: VolumeItem) => {
    return allItems.indexOf(item.rid) + 1;
  };
  const linkClassName = (id: string) =>
    classNames('cursor-pointer rounded-md p-2 hover:bg-gray-100', {
      'text-blue-500': id === activeCategory,
      'text-gray-700': id !== activeCategory,
    });

  const ticking = useRef(false);
  const categoryEles = useRef<CategoryTopRange[]>([]);

  useEffect(() => {
    categoryEles.current = [];
    categoryList?.forEach((category, index: number) => {
      const id = `#category-${category.category_id}`;
      const el: any = document.querySelector(id);
      console.log(id, el.offsetTop);

      let categoryTopRange: CategoryTopRange = {
        id,
        start: 0,
        end: 0,
      };

      if (index === categoryList.length - 1) {
        categoryTopRange = {
          id,
          start: el.offsetTop,
          end: document.body.offsetHeight,
        };
      } else {
        const nextCategory: VolumeCategory = categoryList[index + 1];
        const nextEl: any = document.querySelector(
          `#category-${nextCategory.category_id}`
        );

        categoryTopRange = {
          id,
          start: el.offsetTop,
          end: nextEl.offsetTop,
        };
      }
      categoryEles.current.push(categoryTopRange);
    });
    console.log(categoryEles.current);
  }, [categoryList]);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    console.log(body);
    body.onscroll = (e: any) => {
      // console.dir(e)
      if (!ticking.current) {
        window.requestAnimationFrame(function () {
          const top = e.srcElement.documentElement.scrollTop || 0;
          const category: CategoryTopRange | undefined =
            categoryEles.current.find(
              (cate: CategoryTopRange) => cate.start <= top && cate.end > top
            );
          console.log(top, category, categoryEles);
          if (category) {
            setActiveCategory((category as CategoryTopRange).id);
          }
          ticking.current = false;
        });

        ticking.current = true;
      }
    };
  }, [categoryEles]);

  return (
    <div className='relative pb-6'>
      <Seo title={`HelloGitHub 第 ${current_num} 期`} />
      <div className='my-6 bg-white p-5'>
        <div className='my-6 flex flex-col items-center px-2'>
          <h1 className='mb-2 font-medium text-gray-700'>
            《HelloGitHub》第 {current_num} 期
          </h1>
          <h2 className='text-center text-xl font-normal text-gray-400'>
            兴趣是最好的老师，HelloGitHub 让你对编程感兴趣！
          </h2>
        </div>
        {categoryList?.map((category: VolumeCategory, _cIndex: number) => {
          const id = `category-${category.category_id}`;
          return (
            <div id={id} key={category.category_id} className='pb-10'>
              <h1 className='mt-5 text-xl text-gray-900'>
                {category.category_name}
              </h1>
              {category.items.map((item: VolumeItem) => {
                return (
                  <div key={item.rid}>
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
      <div className='absolute top-0 right-0 hidden p-4 md:block md:grow-0'>
        <div className='fixed top-20 right-64'>
          <div className='w-64 rounded-sm bg-white p-4'>
            <h4 className='mb-2 border-b border-gray-200 pb-2'>目录</h4>
            <ul
              className='custom-scrollbar overflow-scroll'
              style={{ maxHeight: 550 }}
            >
              {categoryList?.map((category, cIndex: number) => {
                const id = `#category-${category.category_id}`;

                return (
                  <li
                    key={cIndex}
                    className={linkClassName(id)}
                    onClick={() => {
                      setActiveCategory(id);
                      const ele: any = document.querySelector(id);
                      console.dir(ele);
                      const { offsetTop } = ele;
                      // 根据 offsetTop 滚动到指定位置
                      window.scrollTo({
                        top: offsetTop - 20,
                      });
                    }}
                  >
                    {category.category_name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div
          onClick={() => {
            // 滚动到顶部
            window.scrollTo({
              top: 0,
            });
            setActiveCategory('');
          }}
          className='fixed bottom-10 right-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md'
        >
          <ToTop />
        </div>
      </div>
      <Pagination
        total={total}
        current={current_num}
        onPageChange={onPageChange}
      />
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
