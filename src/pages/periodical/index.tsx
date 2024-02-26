import { NextPage } from 'next';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import Button from '@/components/buttons/Button';
import { RepoModal } from '@/components/dialog/RepoModal';
import CustomLink from '@/components/links/CustomLink';
import { PeriodicalSkeleton } from '@/components/loading/skeleton';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { numFormat } from '@/utils/util';

import { AllItems, CategroyName, VolumeNum } from '@/types/periodical';

const PeriodicalIndexPage: NextPage = () => {
  const [category, setCategory] = useState('');
  const [volume, setVolume] = useState('');

  const { data, isValidating } = useSWRImmutable<AllItems>(
    makeUrl('/periodical/'),
    fetcher
  );
  const categories = data?.success ? data.categories : [];
  const volumes = data?.success ? data.volumes : [];
  const repo_total = data?.success ? data.repo_total : 0;

  const selectVolume = (e: any) => {
    setVolume(e.target.value);
  };

  const selectCategory = (e: any) => {
    setCategory(e.target.value);
  };

  return (
    <>
      <Seo
        title='HelloGitHub｜月刊'
        description='这里有内容包括开发利器、开源书籍、教程、企业级的开源项目，让发现编程的乐趣你爱上开源！'
      />

      <div className='relative'>
        <Navbar middleText='HelloGitHub 月刊' />
        <div className='my-2 bg-white px-4 pt-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='flex flex-col items-center'>
            <img src='https://img.hellogithub.com/logo/readme.gif'></img>
            <p className='px-1 py-3 leading-7'>
              <strong>「HelloGitHub 月刊」</strong>分享 GitHub
              上有趣、入门级的开源项目，每月 28
              号发布最新一期。内容包括开发利器、开源书籍、教程、企业级项目等，
              让你发现编程的乐趣、爱上开源！
            </p>
          </div>
          {isValidating ? (
            <PeriodicalSkeleton />
          ) : (
            <dl className='grid grid-cols-3 gap-2'>
              <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  已发布
                </dt>
                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {volumes.length}
                </dd>
                <span className='pt-3 text-base font-medium text-gray-500'>
                  期
                </span>
                <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
                  <div className='py-3'>
                    <span className='hidden text-sm md:inline-block'>
                      选择期数：
                    </span>
                    <select
                      onChange={selectVolume}
                      className='w-fit truncate text-ellipsis rounded-md border border-opacity-0 py-1 pr-7 text-sm dark:bg-gray-700'
                    >
                      {volumes.map((item: VolumeNum) => (
                        <option key={item.num} value={item.num}>
                          {item.num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='order-last mt-4'>
                  <CustomLink
                    href={
                      volume == ''
                        ? `/periodical/volume/${volumes.length}`
                        : `periodical/volume/${volume}`
                    }
                  >
                    <Button
                      variant='white-outline'
                      className='px-4 py-1 font-medium'
                    >
                      阅读
                    </Button>
                  </CustomLink>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  共包含
                </dt>

                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {categories.length}
                </dd>

                <span className='pt-3 text-base font-medium text-gray-500'>
                  类
                </span>

                <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
                  <div className='py-3'>
                    <span className='hidden text-sm md:inline-block'>
                      选择分类：
                    </span>

                    <select
                      onChange={selectCategory}
                      className='w-full truncate text-ellipsis rounded-md border border-opacity-0 py-1 pr-7 text-sm dark:bg-gray-700 md:w-28'
                    >
                      {categories.map((item: CategroyName) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='order-last mt-4'>
                  <CustomLink
                    href={
                      volume == ''
                        ? `/periodical/category/${categories[0].name}`
                        : `periodical/category/${category}`
                    }
                  >
                    <Button
                      variant='white-outline'
                      className='px-4 py-1 font-medium'
                    >
                      查看
                    </Button>
                  </CustomLink>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-gray-200 px-2 pt-4 pb-4 text-center dark:border-gray-700 md:px-4 md:pt-6'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  项目数
                </dt>

                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {numFormat(repo_total, 1)}
                </dd>

                <span className='pt-3 text-base font-medium text-gray-500'>
                  个
                </span>

                <div className='mt-6 border-y border-gray-100 dark:border-gray-600'>
                  <div className='h-[54px] py-3'>
                    <span className='text-xs md:text-base'>
                      欢迎推荐和自荐项目
                    </span>
                  </div>
                </div>

                <div className='order-last mt-4'>
                  <RepoModal>
                    <Button
                      variant='white-outline'
                      className='px-4 py-1 font-medium'
                    >
                      推荐
                    </Button>
                  </RepoModal>
                </div>
              </div>
            </dl>
          )}
          <div className='h-4 lg:h-2'></div>
        </div>
      </div>
    </>
  );
};

export default PeriodicalIndexPage;
