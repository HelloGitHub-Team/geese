import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';
import useUserDetailInfo from '@/hooks/user/useUserDetailInfo';

import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import CollectionList from '@/components/user/CollectionList';
import CommentList from '@/components/user/CommentList';
import DynamicRecordList from '@/components/user/DynamicRecordList';

import { formatZH } from '@/utils/day';

import VoteList from './VoteList';

const tabList = [
  { key: 'dynamic', title: '动态' },
  { key: 'favorite', title: '收藏夹' },
  { key: 'comment', title: '评论' },
  { key: 'vote', title: '点赞' },
];

const User = () => {
  const router = useRouter();
  const { uid, tab, fid } = router.query;
  const userDetailInfo = useUserDetailInfo(uid as string);
  const [activeTab, setActiveTab] = useState<string>(tab as string);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as string);
    } else {
      setActiveTab('dynamic');
    }
  }, [tab]);

  return (
    <>
      <Seo title='HelloGitHub｜用户首页' />
      <div className='h-screen divide-y divide-gray-100 dark:divide-gray-800'>
        <Navbar middleText='个人主页'></Navbar>
        {userDetailInfo?.nickname && (
          <>
            {/* PC端 */}
            <div className='hidden rounded-lg bg-white p-4 dark:bg-gray-800 sm:p-6 md:flex'>
              <div className='shrink-0'>
                <img
                  className='rounded-full bg-white dark:bg-gray-800'
                  src={userDetailInfo?.avatar}
                  width='90'
                  height='90'
                  alt='profile_avatar'
                />
              </div>
              <div className='ml-5 flex flex-1 flex-col justify-center'>
                <div className='my-2 flex items-center'>
                  <div className='w-px max-w-fit flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold dark:text-gray-300'>
                    {userDetailInfo?.nickname}
                  </div>
                  <div className='ml-2 text-sm font-bold text-blue-500'>
                    Lv{userDetailInfo?.level}
                  </div>
                </div>
                <div className='text-sm leading-6 text-gray-500 dark:text-gray-400'>
                  <div>
                    {userDetailInfo.in_person ? '你' : '他'}是 HelloGitHub
                    社区的第{' '}
                    <span className='font-bold dark:text-gray-300'>
                      {userDetailInfo?.rank}
                    </span>{' '}
                    位小伙伴，于{' '}
                    <span className='font-bold dark:text-gray-300'>
                      {formatZH(
                        userDetailInfo?.first_login,
                        'YYYY 年 MM 月 DD 日'
                      )}
                    </span>{' '}
                    加入。
                  </div>
                  <div>
                    已分享{' '}
                    <span className='font-bold dark:text-gray-300'>
                      {userDetailInfo?.share_repo_total}
                    </span>{' '}
                    个开源项目{' '}
                    <span className='font-bold dark:text-gray-300'>
                      {userDetailInfo?.comment_repo_total}
                    </span>{' '}
                    份开源测评，共获得{' '}
                    <span className='font-bold dark:text-gray-300'>
                      {userDetailInfo?.contribute_total}
                    </span>{' '}
                    点贡献值。
                  </div>
                  <div>{userDetailInfo?.last_login}</div>
                </div>
              </div>
            </div>

            {/* 移动端 */}
            <div className='align-center flex flex-col bg-white p-4 dark:bg-gray-800 sm:p-6 md:hidden md:rounded-lg'>
              <div className='mx-auto flex'>
                <img
                  className='rounded-full bg-white dark:bg-gray-800'
                  src={userDetailInfo?.avatar}
                  width='72'
                  height='72'
                  alt='profile_avatar'
                />
              </div>
              <div className='flex flex-col'>
                <div className='mx-auto mt-2 flex w-32 items-center justify-center'>
                  <div className=' self-end overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold dark:text-gray-300'>
                    {userDetailInfo?.nickname}
                  </div>
                  <div className='ml-1 self-end text-sm font-bold text-blue-500'>
                    <span className='align-[0.4px]'>
                      Lv{userDetailInfo?.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-center justify-center text-sm leading-6 text-gray-500 dark:text-gray-400'>
                <p>
                  {userDetailInfo.in_person ? '你' : '他'}是 HelloGitHub
                  社区的第{' '}
                  <span className='font-bold dark:text-gray-300'>
                    {' '}
                    {userDetailInfo?.rank}{' '}
                  </span>{' '}
                  位小伙伴
                </p>
                <p>
                  于{' '}
                  {formatZH(userDetailInfo?.first_login, 'YYYY 年 MM 月 DD 日')}{' '}
                  加入共获得{' '}
                  <span className='font-bold dark:text-gray-300'>
                    {userDetailInfo?.contribute_total}
                  </span>{' '}
                  点贡献值
                </p>
                <p>
                  已分享{' '}
                  <span className='font-bold dark:text-gray-300'>
                    {userDetailInfo?.share_repo_total}
                  </span>{' '}
                  个开源项目{' '}
                  <span className='font-bold dark:text-gray-300'>
                    {userDetailInfo?.comment_repo_total}
                  </span>{' '}
                  份开源测评
                </p>
              </div>
            </div>
          </>
        )}
        <div className='mt-2 bg-white px-6 py-3 dark:bg-gray-800 md:rounded-lg'>
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='-mb-0.5 flex space-x-6'>
              {tabList
                .filter(
                  (_, index) =>
                    [0, 1].includes(index) || userDetailInfo?.in_person
                )
                .map((tab) => {
                  return (
                    <Link key={tab.key} href={`/user/${uid}/${tab.key}`}>
                      <span
                        key={tab.key}
                        className={clsxm(
                          'inline-flex cursor-pointer items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-gray-500 hover:text-blue-600 dark:text-gray-400',
                          {
                            '!border-blue-500 !text-blue-500':
                              activeTab === tab.key,
                          }
                        )}
                      >
                        {tab.title}
                      </span>
                    </Link>
                  );
                })}
            </nav>
          </div>
          <div>
            {activeTab === tabList[0].key && (
              <DynamicRecordList uid={uid as string} />
            )}
            {activeTab === tabList[1].key && (
              <CollectionList uid={uid as string} fid={fid as string} />
            )}
            {activeTab === tabList[2].key && (
              <CommentList uid={uid as string} />
            )}
            {activeTab === tabList[3].key && <VoteList uid={uid as string} />}
          </div>
        </div>
        <div className='h-2'></div>
      </div>
    </>
  );
};

export default User;
