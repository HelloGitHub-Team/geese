import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';
import useUserDetailInfo from '@/hooks/user/useUserDetailInfo';

import Seo from '@/components/Seo';
import CollectionList from '@/components/user/CollectionList';
import CommentList from '@/components/user/CommentList';
import DynamicRecordList from '@/components/user/DynamicRecordList';

import { formatZH } from '@/utils/day';

const tabList = [
  { key: 1, title: '动态' },
  { key: 2, title: '收藏' },
  { key: 3, title: '评论' },
];

export default function User() {
  const router = useRouter();
  const { uid } = router.query;
  const userDetailInfo = useUserDetailInfo(uid as string);
  const [activeTab, setActiveTab] = React.useState<number>(1);

  return (
    <>
      <Seo templateTitle={userDetailInfo?.nickname} />
      <div className='bg-content my-2 h-screen divide-y divide-slate-100'>
        {userDetailInfo?.nickname && (
          <div className='flex rounded-lg bg-white p-6'>
            <div className='shrink-0'>
              <Image
                src={userDetailInfo?.avatar}
                alt={userDetailInfo?.nickname}
                width={90}
                height={90}
                className='rounded-full bg-white'
              />
            </div>
            <div className='ml-5 flex flex-1 flex-col justify-center'>
              <div className='mb-2 flex items-center'>
                <div className='w-px max-w-fit flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold'>
                  {userDetailInfo?.nickname}
                </div>
                <div className='ml-2 text-sm font-bold text-yellow-500'>
                  Lv{userDetailInfo?.rank}
                </div>
                <div className='ml-2 text-sm font-bold text-yellow-500'>
                  贡献值 {userDetailInfo?.contribute_total}
                </div>
              </div>
              <div className='text-sm leading-6 text-gray-500'>
                你是 HelloGitHub 社区的第{' '}
                <span className='font-bold'>{userDetailInfo?.rank}</span>{' '}
                位小伙伴，于{' '}
                <span className='font-bold'>
                  {formatZH(
                    userDetailInfo?.first_login,
                    'YYYY 年 MM 月 DD 日 HH:mm'
                  )}
                </span>{' '}
                加入，已分享{' '}
                <span className='font-bold'>
                  {userDetailInfo?.share_repo_total}
                </span>{' '}
                个开源项目，
                <span className='font-bold'>
                  {userDetailInfo?.comment_repo_total}
                </span>{' '}
                份开源测评。
                <div>{userDetailInfo?.last_login}</div>
              </div>
            </div>
          </div>
        )}
        <div className='mt-2 h-full rounded-lg bg-white p-6'>
          <div className='border-b-2 border-gray-200 dark:border-gray-700'>
            <nav className='-mb-0.5 flex space-x-6'>
              {tabList.map((tab) => {
                return (
                  <span
                    key={tab.key}
                    className={clsxm(
                      'text-xm inline-flex items-center gap-2 whitespace-nowrap border-b-[3px] border-transparent py-4 px-1 text-gray-500 hover:text-blue-600',
                      {
                        'border-blue-500 font-medium': activeTab === tab.key,
                      }
                    )}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.title}
                  </span>
                );
              })}
            </nav>
          </div>
          <div>
            {activeTab === 1 && (
              <DynamicRecordList uid={uid as string}></DynamicRecordList>
            )}
            {activeTab === 2 && (
              <CollectionList uid={uid as string}></CollectionList>
            )}
            {activeTab === 3 && <CommentList uid={uid as string}></CommentList>}
          </div>
        </div>
        <div className='h-2'></div>
      </div>
    </>
  );
}
