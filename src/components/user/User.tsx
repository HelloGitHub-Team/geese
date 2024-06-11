import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import clsxm from '@/lib/clsxm';

import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import CollectionList from '@/components/user/CollectionList';
import { CommentList } from '@/components/user/CommentList';
import DynamicRecordList from '@/components/user/DynamicRecordList';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { formatZH } from '@/utils/day';

import RepoList from './RepoList';
import VoteList from './VoteList';
import { ProfileSkeleton } from '../loading/skeleton';

import { UserDetailInfo } from '@/types/user';

const tabList = [
  { key: 'dynamic', title: '动态' },
  { key: 'favorite', title: '收藏' },
  { key: 'comment', title: '评论' },
  { key: 'vote', title: '点赞' },
  { key: 'repo', title: '项目' },
];

const User = () => {
  const router = useRouter();
  const { uid, tab, fid } = router.query;
  const [activeTab, setActiveTab] = useState<string>(
    (tab as string) || 'dynamic'
  );

  const { data, isValidating } = useSWRImmutable<UserDetailInfo>(
    uid ? makeUrl(`/user/${uid}`) : null,
    fetcher
  );

  const userDetailInfo = data?.userInfo;
  const dynamicRecord = data?.dynamicRecord || [];

  useEffect(() => {
    if (tab) setActiveTab(tab as string);
  }, [tab]);

  const renderUserDetails = () => {
    if (isValidating || !userDetailInfo) return <ProfileSkeleton />;

    const {
      avatar,
      nickname,
      level,
      rank,
      in_person,
      first_login,
      share_repo_total,
      comment_repo_total,
      contribute_total,
      last_login,
    } = userDetailInfo;

    return (
      <>
        <div className='mx-auto flex h-[72px] w-[72px] md:block md:h-20 md:w-20 md:shrink-0 '>
          <img
            className='rounded-full bg-white dark:bg-gray-800'
            src={avatar}
            alt='profile_avatar'
          />
        </div>

        <div className='flex flex-col md:ml-4 md:flex-1 md:justify-center'>
          <div className='mx-auto mt-2 flex w-32 items-center justify-center md:mx-0 md:mb-1 md:mt-0 md:w-80 md:justify-start'>
            <div className='self-end overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold dark:text-gray-300 md:w-px md:max-w-fit md:flex-1 md:self-center md:text-lg'>
              {nickname}
            </div>
            <div className='ml-1 self-end text-sm font-bold text-blue-500 md:ml-2 md:self-center'>
              Lv{level}
            </div>
          </div>
          <div className='hidden text-sm leading-6 text-gray-500 dark:text-gray-400 md:block'>
            <div>
              {in_person ? '你' : '他'}是 HelloGitHub 社区的第
              <span className='mx-1 font-bold dark:text-gray-300'>{rank}</span>
              位用户，于{formatZH(first_login, ' YYYY 年 MM 月 DD 日 ')}加入。
            </div>
            <div>
              已分享
              <span className='mx-1 font-bold dark:text-gray-300'>
                {share_repo_total}
              </span>
              个开源项目
              <span className='mx-1 font-bold dark:text-gray-300'>
                {comment_repo_total}
              </span>
              份项目评价，共获得
              <span className='mx-1 font-bold dark:text-gray-300'>
                {contribute_total}
              </span>
              点贡献值。
            </div>
            <div>{last_login}</div>
          </div>
          <div className='flex flex-col items-center justify-center text-sm leading-6 text-gray-500 dark:text-gray-400 md:hidden'>
            <p>
              {in_person ? '你' : '他'}是 HelloGitHub 社区的第
              <span className='mx-1 font-bold dark:text-gray-300'>{rank}</span>
              位用户
            </p>
            <p>
              于{formatZH(first_login, ' YYYY 年 MM 月 DD 日 ')}加入共获得
              <span className='mx-1 font-bold dark:text-gray-300'>
                {contribute_total}
              </span>
              点贡献值
            </p>
            <p>
              已分享
              <span className='mx-1 font-bold dark:text-gray-300'>
                {share_repo_total}
              </span>
              个开源项目
              <span className='mx-1 font-bold dark:text-gray-300'>
                {comment_repo_total}
              </span>
              份项目评价
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dynamic':
        return <DynamicRecordList items={dynamicRecord} />;
      case 'favorite':
        return <CollectionList uid={uid as string} fid={fid as string} />;
      case 'comment':
        return <CommentList uid={uid as string} />;
      case 'vote':
        return <VoteList uid={uid as string} />;
      case 'repo':
        return <RepoList uid={uid as string} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Seo title='用户首页' />
      <div className='h-screen divide-y divide-gray-100 dark:divide-gray-800'>
        <Navbar middleText='个人主页' />
        <div className='flex flex-col bg-white p-4 dark:bg-gray-800 sm:p-6 md:flex-row md:rounded-lg'>
          {renderUserDetails()}
        </div>
        <div className='mt-2 bg-white px-6 py-3 dark:bg-gray-800 md:rounded-lg'>
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='-mb-0.5 flex space-x-6'>
              {tabList
                .filter(
                  (_, index) =>
                    [0, 1].includes(index) || userDetailInfo?.in_person
                )
                .map(({ key, title }) => (
                  <Link key={key} href={`/user/${uid}/${key}`}>
                    <span
                      className={clsxm(
                        'inline-flex cursor-pointer items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-gray-500 hover:text-blue-600 dark:text-gray-400',
                        { '!border-blue-500 !text-blue-500': activeTab === key }
                      )}
                    >
                      {title}
                    </span>
                  </Link>
                ))}
            </nav>
          </div>
          {renderContent()}
        </div>
        <div className='h-2' />
      </div>
    </>
  );
};

export default User;
