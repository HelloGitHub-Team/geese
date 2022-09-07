import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';
import useUserDetailInfo from '@/hooks/user/useUserDetailInfo';

import Seo from '@/components/Seo';
import CollectionList from '@/components/user/CollectionList';
import CommentList from '@/components/user/CommentList';
import DynamicRecordList from '@/components/user/DynamicRecordList';

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
            <Image
              src={userDetailInfo?.avatar}
              alt={userDetailInfo?.nickname}
              width={90}
              height={90}
              className='h-24 w-24 rounded-full bg-white'
            />
            <div className='ml-5 flex flex-col justify-center'>
              <div className='flex justify-between'>
                <div className='mb-2'>
                  <span className='text-lg font-bold'>
                    {userDetailInfo?.nickname}
                  </span>
                  <span className='ml-4 italic'>Lv.{userDetailInfo?.rank}</span>
                </div>
                <span>
                  贡献值：
                  <span className='text-lg font-semibold'>
                    {userDetailInfo?.contribute_total}
                  </span>
                </span>
              </div>
              <div>
                你是 HelloGitHub 社区的第 {userDetailInfo?.rank} 位小伙伴
              </div>
              <div>
                于 {userDetailInfo?.first_login.replace(/T/g, ' ')} 加入，已分享{' '}
                {userDetailInfo?.share_repo_total} 个开源项目，
                {userDetailInfo?.comment_repo_total} 份开源测评
              </div>
              <div>{userDetailInfo?.last_login}</div>
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
      </div>
    </>
  );
}
