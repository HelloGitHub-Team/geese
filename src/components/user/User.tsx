import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

import clsxm from '@/lib/clsxm';

import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import { LevelRender } from '@/components/user/Common';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { format, formatZH } from '@/utils/day';

import CollectionList from './CollectionList';
import CommentList from './CommentList';
import DynamicRecordList from './DynamicRecordList';
import RepoList from './RepoList';
import VoteList from './VoteList';
import { ProfileSkeleton } from '../loading/skeleton';

import { UserDetailInfo } from '@/types/user';

// 拆分用户信息组件
const UserProfile: React.FC<{
  userInfo: UserDetailInfo['userInfo'];
  i18n: { language: string };
  t: (key: string, options?: any) => any;
}> = ({ userInfo, i18n, t }) => {
  const {
    avatar,
    nickname,
    level,
    rank,
    first_login,
    share_repo_total,
    comment_repo_total,
    contribute_total,
  } = userInfo;

  const dateFormatted = useMemo(
    () =>
      i18n.language === 'en' ? format(first_login) : formatZH(first_login),
    [first_login, i18n.language]
  );

  return (
    <>
      <div className='mx-auto flex h-[72px] w-[72px] md:block md:h-20 md:w-20 md:shrink-0'>
        <img
          className='rounded-full bg-white dark:bg-gray-800'
          src={avatar}
          alt={`${nickname}'s avatar`}
          loading='lazy'
        />
      </div>

      <div className='flex flex-col md:ml-4 md:flex-1 md:justify-center'>
        <div className='mx-auto mt-2 mb-1 flex w-60 items-center justify-center md:mx-0 md:mb-0 md:mt-0 md:w-80 md:justify-start'>
          <div className='w-30 self-end overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold dark:text-gray-300 md:w-px md:max-w-fit md:flex-1 md:self-center md:text-lg'>
            {nickname}
          </div>
          <div className='ml-1 self-end text-base text-blue-500 md:ml-2 md:self-center'>
            {LevelRender(level, true, i18n.language)}
          </div>
        </div>

        {/* Desktop Info */}
        <div className='hidden text-sm leading-6 text-gray-500 dark:text-gray-400 md:block'>
          <div>{t('user_info.desc', { rank, date: dateFormatted })}</div>
          <div>
            {t('user_info.desc2', {
              share_repo: share_repo_total,
              comment_repo: comment_repo_total,
              contribute: contribute_total,
            })}
          </div>
        </div>

        {/* Mobile Info */}
        <div className='flex flex-col items-center justify-center text-sm leading-6 text-gray-500 dark:text-gray-400 md:hidden'>
          <p>{t('user_info.desc3', { rank })}</p>
          <p>
            {t('user_info.desc4', {
              date: dateFormatted,
              contribute: contribute_total,
            })}
          </p>
          <p>
            {t('user_info.desc5', {
              share_repo: share_repo_total,
              comment_repo: comment_repo_total,
            })}
          </p>
        </div>
      </div>
    </>
  );
};

// 拆分标签页组件
const TabNav: React.FC<{
  tabs: Array<{ key: string; title: string }>;
  activeTab: string;
  uid: string;
  showAllTabs: boolean;
}> = ({ tabs, activeTab, uid, showAllTabs }) => {
  return (
    <nav className='flex space-x-2 md:space-x-8'>
      {tabs
        .filter((_, index) => showAllTabs || [0, 1].includes(index))
        .map(({ key, title }) => (
          <Link prefetch={false} key={key} href={`/user/${uid}/${key}`}>
            <span
              className={clsxm(
                'inline-flex cursor-pointer items-center gap-1 whitespace-nowrap border-b-2 border-transparent p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400',
                { '!border-blue-500 !text-blue-500': activeTab === key }
              )}
            >
              {title}
            </span>
          </Link>
        ))}
    </nav>
  );
};

// 主组件
const User: React.FC = () => {
  const { t, i18n } = useTranslation('profile');
  const router = useRouter();
  const { uid, tab, fid } = router.query;

  const { data, isValidating } = useSWRImmutable<UserDetailInfo>(
    uid ? makeUrl(`/user/${uid}`) : null,
    fetcher
  );

  const activeTab = (tab as string) || 'dynamic';
  const userDetailInfo = data?.userInfo;
  const dynamicRecord = data?.dynamicRecord || [];

  const tabs = useMemo(
    () => [
      { key: 'dynamic', title: t('tabs.dynamic') },
      { key: 'favorite', title: t('tabs.favorite') },
      { key: 'comment', title: t('tabs.comment') },
      { key: 'vote', title: t('tabs.vote') },
      { key: 'repo', title: t('tabs.repo') },
    ],
    [t]
  );

  const contentMap = useMemo(
    () => ({
      dynamic: (
        <DynamicRecordList
          items={dynamicRecord}
          t={t}
          i18n_lang={i18n.language}
        />
      ),
      favorite: (
        <CollectionList uid={uid as string} fid={fid as string} t={t} />
      ),
      comment: (
        <CommentList uid={uid as string} t={t} i18n_lang={i18n.language} />
      ),
      vote: <VoteList uid={uid as string} t={t} />,
      repo: <RepoList uid={uid as string} t={t} />,
    }),
    [dynamicRecord, uid, fid, t, i18n.language]
  );

  if (!uid) return null;

  return (
    <>
      <Seo title={t('title')} />
      <div className='h-screen divide-y divide-gray-100 dark:divide-gray-800'>
        <Navbar middleText={t('title')} />

        <div className='flex flex-col bg-white p-4 dark:bg-gray-800 sm:p-6 md:flex-row md:rounded-lg'>
          {isValidating || !userDetailInfo ? (
            <ProfileSkeleton />
          ) : (
            <UserProfile userInfo={userDetailInfo} i18n={i18n} t={t} />
          )}
        </div>

        <div className='mt-2 bg-white px-4 py-3 dark:bg-gray-800 md:rounded-lg md:px-6'>
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <TabNav
              tabs={tabs}
              activeTab={activeTab}
              uid={uid as string}
              showAllTabs={!!userDetailInfo?.in_person}
            />
          </div>
          {contentMap[activeTab as keyof typeof contentMap]}
        </div>

        <div className='h-2' />
      </div>
    </>
  );
};

export default User;
