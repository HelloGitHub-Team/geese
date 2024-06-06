import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { GoListUnordered } from 'react-icons/go';

import Drawer from '@/components/drawer/Drawer';
import Pagination from '@/components/pagination/Pagination';
import PeriodItem from '@/components/periodical/item';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getVolume, getVolumeNum } from '@/services/volume';

import { VolumePageProps } from '@/types/periodical';
import { PeriodicalItem, VolumeCategory } from '@/types/periodical';

type CategoryTopRange = {
  id: string;
  start: number;
  end: number;
};

const PeriodicalVolumePage: NextPage<VolumePageProps> = ({ volume }) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  // 月刊列表
  const categoryList: VolumeCategory[] = useMemo(() => {
    return volume?.data || [];
  }, [volume]);

  const goBack = () => {
    if (window.history.length < 2) {
      router.push('/');
    } else {
      router.back();
    }
  };

  const allItems: string[] = categoryList
    .reduce((acc: any, category: any) => {
      return acc.concat(category.items);
    }, [])
    .map((item: PeriodicalItem) => item.rid);

  const itemIndex = (item: PeriodicalItem) => {
    return allItems.indexOf(item.rid);
  };

  const onPageChange = (page: number) => {
    router.push(`/periodical/volume/${page}`);
  };

  const linkClassName = (id: string) =>
    classNames(
      'cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700',
      {
        'text-blue-500': id === activeCategory,
        'text-gray-700 dark:text-gray-400': id !== activeCategory,
      }
    );

  const ticking = useRef(false);
  const categoryEles = useRef<CategoryTopRange[]>([]);
  const detectInVision = (elementList: Element[]) => {
    /*优先匹配元素 完全包含当前可视区域，以及完全处在当前可视区域*/
    const strongMatch: Element | undefined = elementList.find((el: Element) => {
      const topCurrentHeight = el.getBoundingClientRect().top;
      const bottomCurrentHeight = el.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      return (
        (topCurrentHeight < 0 && bottomCurrentHeight > windowHeight) ||
        (topCurrentHeight > 0 && bottomCurrentHeight < windowHeight)
      );
    });
    if (strongMatch) {
      return strongMatch;
    } else {
      /*优先匹配未果时，查找非理想状态匹配 一部分在当前可视区域，而可视区域的另一部分被另一个category占据，此时比大小占用是否过半*/
      const weakMatch: Element | undefined = elementList.find((el: Element) => {
        const topCurrentHeight = el.getBoundingClientRect().top;
        const bottomCurrentHeight = el.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        return (
          (topCurrentHeight < 0 && bottomCurrentHeight > windowHeight / 2) ||
          (topCurrentHeight < windowHeight / 2 &&
            bottomCurrentHeight > windowHeight)
        );
      });
      if (weakMatch) {
        return weakMatch;
      } else {
        return null;
      }
    }
  };
  // 设置每个段落的top值范围, 用于滚动时判断对应目录标题高亮
  useEffect(() => {
    categoryEles.current = [];
    categoryList?.forEach((category, index: number) => {
      const id = `#category-${category.category_id}`;
      const el: HTMLElement = document.querySelector(id) as HTMLElement;

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
        const nextEl: HTMLElement = document.querySelector(
          `#category-${categoryList[index + 1].category_id}`
        ) as HTMLElement;

        categoryTopRange = {
          id,
          start: el.offsetTop,
          end: nextEl.offsetTop,
        };
      }
      categoryEles.current.push(categoryTopRange);
    });
  }, [categoryList]);

  // 监听 body 滚动事件, 设置对应当前内容的目录标题高亮
  useEffect(() => {
    const body: HTMLElement = document.getElementsByTagName(
      'body'
    )[0] as HTMLElement;

    body.onscroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(function () {
          const inVisionElement = detectInVision(
            Array.from(document.querySelectorAll('.language-hash'))
          );
          if (inVisionElement) {
            setActiveCategory('#' + inVisionElement.id);
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
  }, [categoryEles]);

  if (router.isFallback) {
    return (
      <div className='mt-20 flex animate-pulse'>
        <Seo title='HelloGitHub 月刊' />
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

  // 渲染目录列表
  const directoryList = (isPhone = false) => {
    return categoryList?.map((category, cIndex) => {
      const id = `#category-${category.category_id}`;

      return (
        <li
          key={cIndex}
          className={linkClassName(id)}
          style={{
            paddingBottom:
              isPhone && cIndex === categoryList.length - 1 ? '40px' : '8px',
          }}
          onClick={() => {
            setActiveCategory(id);
            const { offsetTop } = document.querySelector(id) as HTMLElement;
            // 根据 offsetTop 滚动到指定位置
            window.scrollTo({
              top: offsetTop,
            });
          }}
        >
          {category.category_name}
        </li>
      );
    });
  };

  return (
    <>
      <Seo title={`《HelloGitHub 月刊》第 ${volume?.current_num} 期`} />

      <div className='flex shrink grow flex-row sm:border-l md:border-none'>
        <div className='relative w-0 shrink grow lg:w-9/12 lg:grow-0'>
          <div className='relative pb-6'>
            <div className='relative my-2 bg-white dark:bg-gray-800 md:rounded-lg'>
              <div className='flex h-12 items-center justify-between py-2 px-4'>
                <div className='cursor-pointer' onClick={goBack}>
                  <AiOutlineArrowLeft
                    className='text-gray-500 hover:text-blue-400'
                    size={18}
                  />
                </div>
                <div className='text-centerdark:text-gray-300 w-3/4 truncate'>
                  <Pagination
                    total={volume?.total}
                    current={volume?.current_num}
                    onPageChange={onPageChange}
                  />
                </div>

                <div className='hidden justify-end text-sm text-gray-500 dark:text-gray-400 md:block'>
                  期数
                </div>
                <div
                  className='flex cursor-pointer items-center justify-end text-sm text-gray-500 dark:text-gray-400 md:hidden'
                  onClick={() => {
                    // 打开目录弹窗
                    setDrawerVisible(true);
                  }}
                >
                  <GoListUnordered />
                  目录
                </div>
              </div>
            </div>

            <div className='my-2 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
              <div className='flex items-center justify-center pb-4'>
                <h2>《HelloGitHub》第 {volume.current_num} 期</h2>
              </div>
              <div className='text-normal mb-4  dark:bg-gray-800 dark:text-gray-300'>
                <div className='whitespace-pre-wrap rounded-sm bg-gray-50 p-2 font-normal leading-8 text-gray-500 dark:bg-gray-800 dark:text-gray-300'>
                  <p>
                    HelloGitHub 分享 GitHub 上有趣、入门级的开源项目，
                    <span className='font-bold'>每月 28 号</span>更新一期。
                    这里有好玩和入门级的开源项目、开源书籍、实战项目、企业级项目，让你用极短的时间感受到开源的魅力，对开源产生兴趣。
                  </p>
                </div>
              </div>

              {categoryList?.map(
                (category: VolumeCategory, _cIndex: number) => {
                  const id = `category-${category.category_id}`;
                  return (
                    <div
                      id={id}
                      key={category.category_id}
                      className='language-hash pb-4'
                    >
                      <div className='text-center text-xl font-semibold text-black dark:text-white'>
                        {category.category_name}
                      </div>
                      {category.items.map((item: PeriodicalItem) => {
                        const indexNum = itemIndex(item);
                        return (
                          <PeriodItem
                            key={indexNum}
                            item={item}
                            index={indexNum}
                          />
                        );
                      })}
                    </div>
                  );
                }
              )}
            </div>

            <Pagination
              total={volume?.total}
              current={volume?.current_num}
              onPageChange={onPageChange}
            />

            <div className='hidden md:block'>
              <ToTop cb={() => setActiveCategory('')} />
            </div>
          </div>
        </div>

        <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
          {/* 右侧目录 */}
          <div>
            <div className='top-15 fixed w-full max-w-[244px]'>
              <div className='mt-2 ml-3  bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
                <h4 className='mb-2 border-b border-gray-200 pb-2 dark:border-gray-700'>
                  本期目录
                </h4>
                <ul
                  className='custom-scrollbar overflow-scroll'
                  style={{ maxHeight: 560 }}
                >
                  {directoryList()}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端展示的底部目录 */}
        <Drawer
          title='目录'
          visible={drawerVisible}
          placement='bottom'
          onClose={() => setDrawerVisible(false)}
        >
          <div className=' h-full dark:bg-gray-800'>
            <ul className='overflow-auto' style={{ maxHeight: '90%' }}>
              {directoryList(true)}
            </ul>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default PeriodicalVolumePage;

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取月刊的总期数
  const { data } = await getVolumeNum();
  // const posts = data.map(({num}) => ({id: String(num) }));

  // 根据博文列表生成所有需要预渲染的路径
  const paths = data.map((item) => ({
    params: { id: String(item.num) },
  }));

  // We'll pre-render only these paths at build time.
  // {fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

// 在构建时也会被调用
export async function getStaticProps({ params }: any) {
  // params 包含此篇博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const volume = await getVolume(params.id);
  if (!volume.success) {
    return { notFound: true };
  }
  // 通过 props 参数向页面传递博文的数据
  return { props: { volume }, revalidate: 3600 * 10 };
}
