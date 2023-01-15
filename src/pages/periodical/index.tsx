import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import { RepoModal } from '@/components/respository/Submit';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { numFormat } from '@/utils/util';

import { AllItems, CategroyName, VolumeNum } from '@/types/periodical';

const PeriodicalIndexPage: NextPage = () => {
  const router = useRouter();

  const [category, setCategory] = useState('C 项目');
  const [volume, setVolume] = useState('');

  const { data, isValidating } = useSWRImmutable<AllItems>(
    makeUrl('/periodical/'),
    fetcher,
    {
      revalidateIfStale: false,
    }
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

  const handleVolume = () => {
    if (volume == '') {
      router.push(`/periodical/volume/${volumes.length}`);
    } else {
      router.push(`/periodical/volume/${volume}`);
    }
  };
  const handleCategory = () => {
    router.push(`/periodical/category/${encodeURIComponent(category)}`);
  };

  return (
    <>
      <Seo title='HelloGitHub｜月刊' />

      <div className='relative'>
        <Navbar middleText='HelloGitHub 月刊'></Navbar>
        <div className='my-2 bg-white px-4 pt-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='flex flex-col items-center'>
            <img src='https://img.hellogithub.com/logo/readme.gif'></img>
            <p className='py-2 leading-7'>
              「HelloGitHub 月刊」分享 GitHub 上有趣、入门级的开源项目，每月{' '}
              <strong>28</strong>{' '}
              号发布最新一期。内容包括开发利器、开源书籍、教程、企业级项目等，
              让发现编程的乐趣、你爱上开源！
            </p>
          </div>
          {isValidating ? (
            <Loading />
          ) : (
            <dl className='grid grid-cols-3 gap-2'>
              <div className='flex flex-col rounded-lg border border-gray-200 px-4 pt-6 pb-4 text-center dark:border-gray-700'>
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
                      className='w-full truncate text-ellipsis rounded-md border border-opacity-0 py-1 pr-7 text-sm dark:bg-gray-700 md:w-fit'
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
                  <Button
                    onClick={handleVolume}
                    variant='white-outline'
                    className='px-4 py-1 font-medium'
                  >
                    阅读
                  </Button>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-gray-200 px-4 pt-6 pb-4 text-center dark:border-gray-700'>
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
                  <Button
                    onClick={handleCategory}
                    variant='white-outline'
                    className='px-4 py-1 font-medium'
                  >
                    查看
                  </Button>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-gray-200 px-4 pt-6 pb-4 text-center dark:border-gray-700'>
                <dt className='order-first pb-3 text-base font-medium text-gray-500'>
                  项目数
                </dt>

                <dd className='text-4xl font-extrabold text-blue-600 md:text-5xl'>
                  {numFormat(repo_total)}
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
