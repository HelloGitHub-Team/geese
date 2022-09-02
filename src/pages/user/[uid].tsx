import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Seo from '@/components/Seo';

import { getUserInfo } from '@/services/user';

import type { UserInfoType } from '@/types/user';

const tabList = [
  { key: 1, title: '动态' },
  { key: 2, title: '贡献' },
  { key: 3, title: '收藏' },
  { key: 4, title: '测评' },
];

const userInfoProps = {
  uid: '8MKvZoxaWt',
  nickname: '卤蛋',
  avatar:
    'https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELhgSn8KrBspf8KDJQGPwHOKqkZfppGiaQQk3WdxFetbGAYibBzhZ7bLV81JM2qBKVNStLeIo3ryMEA/132',
  contribute_total: 0,
  share_repo_total: 0,
  comment_repo_total: 1,
  permission: {
    name: '游客',
    code: 'visitor',
  },
  first_login: '2022-08-29T20:03:50',
  rank: 1,
  level: 1,
};

export default function User() {
  const router = useRouter();
  const { uid = '8MKvZoxaWt' } = router.query;
  const [userInfo, setUserInfo] = React.useState<UserInfoType>(userInfoProps);
  const [activeTab, setActiveTab] = React.useState<number>(1);

  React.useEffect(() => {
    getUserInfo(uid)
      .then((res) => {
        console.log(JSON.stringify(res));
        // setUserInfo(res.userInfo);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [uid]);

  return (
    <>
      <Seo templateTitle={userInfo.nickname} />
      <div className='bg-content my-2 h-screen divide-y divide-slate-100'>
        {userInfo.nickname && (
          <div className='flex rounded-lg bg-white p-6'>
            <Image
              src={userInfo.avatar}
              alt={userInfo.nickname}
              width={90}
              height={90}
              className='h-24 w-24 rounded-full bg-white'
            />
            <div className='ml-5 flex flex-col justify-center'>
              <div className='flex justify-between'>
                <div className='mb-2'>
                  <span className='text-lg font-bold'>{userInfo.nickname}</span>
                  <span className='ml-4 italic'>Lv.{userInfo.rank}</span>
                </div>
                <span>
                  贡献值：
                  <span className='text-lg font-semibold'>
                    {userInfo.contribute_total}
                  </span>
                </span>
              </div>
              <div>你是 HelloGitHub 社区的第 {userInfo.rank} 位小伙伴</div>
              <div>
                于 {userInfo.first_login.replace(/T/g, ' ')} 加入，已分享{' '}
                {userInfo.share_repo_total} 个开源项目，
                {userInfo.comment_repo_total} 份开源测评
              </div>
              <div>{userInfo.last_login}</div>
            </div>
          </div>
        )}
        <div className='mt-2 h-full rounded-lg bg-white p-6'>
          <div className='border-b-2 border-gray-200 dark:border-gray-700'>
            <nav className='-mb-0.5 flex space-x-6'>
              {tabList.map((tab) => {
                return (
                  <a
                    key={tab.key}
                    className={clsxm(
                      'text-xm inline-flex items-center gap-2 whitespace-nowrap border-b-[3px] border-transparent py-4 px-1 text-gray-500 hover:text-blue-600',
                      {
                        'border-blue-500 font-medium': activeTab === tab.key,
                      }
                    )}
                    href='#'
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.title}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className='text-center'>
            {tabList.find((tab) => tab.key === activeTab).title}
          </div>
        </div>
      </div>
    </>
  );
}
