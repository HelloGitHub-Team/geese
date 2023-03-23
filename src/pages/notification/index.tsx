import { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

import clsxm from '@/lib/clsxm';
import { useLoginContext } from '@/hooks/useLoginContext';

import CustomLink from '@/components/links/CustomLink';
import Loading from '@/components/loading/Loading';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';
import { fromNow } from '@/utils/day';

import { MessageItems, MessageRecord } from '@/types/user';

const tabList = [
  { key: 'repository', title: '开源项目' },
  { key: 'system', title: '系统消息' },
];

const Notification = () => {
  const [activeTab, setActiveTab] = useState<string>('repository');
  const { userInfo, updateUnread } = useLoginContext();
  const { data, error, setSize, isValidating, size } =
    useSWRInfinite<MessageItems>(
      (index) =>
        makeUrl(`/message/`, { message_type: activeTab, page: index + 1 }),
      fetcher,
      { revalidateFirstPage: true }
    );

  const messages = data
    ? data.reduce((pre: MessageRecord[], curr) => {
        if (curr.data?.length > 0) {
          pre.push(...curr.data);
        }
        return pre;
      }, [])
    : [];
  const hasMore = data ? data[data.length - 1].has_more : false;
  const pageIndex = data ? size : 0;

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: hasMore,
    disabled: !!error,
    onLoadMore: () => {
      setSize(pageIndex + 1);
    },
    rootMargin: '0px 0px 100px 0px',
  });

  useEffect(() => {
    if (!isValidating) {
      updateUnread();
    }
  }, [isValidating, updateUnread]);

  type ObjectKey = keyof typeof userInfo;

  const autoLink = (content: string) => {
    const reg =
      '(https|http|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
    const re = new RegExp(reg);
    const newStr = content.match(reg);
    if (newStr) {
      return content.replace(
        re,
        `<a style='color: #3B82F6' target="_blank" href='${newStr[0]}'>${newStr[0]}</a>`
      );
    } else {
      return content;
    }
  };
  return (
    <>
      <Seo title='HelloGitHub｜消息中心' />
      <div className='h-screen divide-y divide-gray-100 dark:divide-gray-800'>
        <Navbar middleText='消息中心'></Navbar>
        <div className='mt-2 bg-white px-6 pt-3 dark:bg-gray-800 md:rounded-lg'>
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='-mb-0.5 flex space-x-6'>
              {tabList
                .filter((_, index) => [0, 1].includes(index))
                .map((tab) => {
                  return (
                    <div
                      onClick={() => {
                        setActiveTab(tab.key);
                      }}
                      key={tab.key}
                      className={clsxm(
                        'inline-flex cursor-pointer items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-2 px-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 md:text-base',
                        {
                          '!border-blue-500 !text-blue-500':
                            activeTab === tab.key,
                        }
                      )}
                    >
                      {tab.title}
                      {userInfo?.unread[tab.key as ObjectKey] ? (
                        <span className='rounded-lg bg-red-500 px-1.5 text-xs text-white'>
                          {userInfo?.unread[tab.key as ObjectKey]}
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
            </nav>
          </div>

          {messages.length ? (
            <div>
              {messages.map((item: MessageRecord) => (
                <article key={item.mid}>
                  <div className='flex w-full flex-row truncate whitespace-normal border-b border-gray-100 py-3.5 dark:border-gray-700 md:px-1.5'>
                    <img
                      className='mr-3 h-10 rounded-full'
                      src='https://img.hellogithub.com/avatar/oTtM-59ZSm1se2ZOMfiT11KzgevQ.jpeg'
                    />
                    <div className='flex flex-col'>
                      {activeTab == 'repository' ? (
                        <span className='text-gray-600 dark:text-gray-500'>
                          你提交的开源项目
                          <CustomLink
                            className='mx-1 inline cursor-pointer text-blue-500'
                            href={`/repository/${item.mid}`}
                          >
                            {item.content}
                          </CustomLink>
                          已被推荐到首页。
                        </span>
                      ) : (
                        <span
                          className='text-gray-600 dark:text-gray-500'
                          dangerouslySetInnerHTML={{
                            __html: autoLink(item.content),
                          }}
                        ></span>
                      )}
                      <div className='flex flex-row pt-1.5 text-sm text-gray-400 dark:text-gray-600'>
                        {fromNow(item.publish_at)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className='mt-4 text-center text-xl'>
              <div className='py-14 text-gray-300 dark:text-gray-500'>
                暂无消息
              </div>
            </div>
          )}
        </div>
        {isValidating || hasMore ? (
          <div
            className='divide-y divide-gray-100 overflow-hidden dark:divide-gray-700'
            ref={sentryRef}
          >
            <Loading></Loading>
          </div>
        ) : (
          <div className='h-4'></div>
        )}
        <ToTop />
      </div>
    </>
  );
};

export default Notification;
