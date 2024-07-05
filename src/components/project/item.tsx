import { NextPage } from 'next';
import Link from 'next/link';
import { AiFillFire, AiOutlineEye } from 'react-icons/ai';
import { GoStar, GoVerified } from 'react-icons/go';

import CustomLink from '@/components/links/CustomLink';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

interface RepositoryItemProps {
  item: {
    item_id?: string;
    rid?: string;
    author_avatar: string;
    is_hot?: boolean;
    is_featured?: boolean;
    is_claimed?: boolean;
    name: string;
    title: string;
    comment_total?: number;
    summary?: string;
    author: string;
    lang_color: string;
    primary_lang: string;
    updated_at: string;
    publish_at?: string;
    clicks_total?: number;
    stars?: number;
  };
  index?: number;
  showCommentCount?: boolean;
  showViewCount?: boolean;
  linkType?: 'default' | 'custom';
}

const RepositoryItem: NextPage<RepositoryItemProps> = ({
  item,
  index,
  showCommentCount = false,
  showViewCount = false,
  linkType = 'default',
}) => {
  const {
    item_id,
    rid,
    author_avatar,
    is_hot,
    is_featured,
    is_claimed,
    name,
    title,
    comment_total,
    summary,
    author,
    lang_color,
    primary_lang,
    updated_at,
    publish_at,
    clicks_total,
    stars,
  } = item;

  const LinkComponent = linkType === 'custom' ? CustomLink : Link;
  const href =
    linkType === 'custom' ? `/repository/${item_id}` : `/repository/${rid}`;
  // 检查 updated_at 格式并进行转换
  let formattedDate: Date | null = null;
  if (updated_at) {
    // 假设 updated_at 的格式为 "yyyy-MM-dd HH:mm:ss"
    const parts = updated_at.split(' ');
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);
      formattedDate = new Date(year, month - 1, day, hour, minute, second); // 注意月份是从 0 开始的
    }
  }

  return (
    <article className='transform rounded-lg shadow-lg transition-transform hover:scale-105'>
      <LinkComponent href={href} aria-label={`Repository ${name}`}>
        <header className='relative cursor-pointer bg-white px-2.5 py-3 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:px-4'>
          {/* 项目序号和标题 */}
          {index !== undefined && (
            <div className='pb-0.5'>
              <div className='text-color-primary flex justify-between visited:text-gray-500 dark:text-gray-300'>
                <span className='truncate text-sm leading-snug  md:text-base'>
                  {index + 1}
                  <span className='pr-0.5'>.</span>
                  {title}
                </span>
                {/* 是否推荐 */}
                {is_featured && (
                  <div className='absolute top-0 right-0 flex items-center rounded-bl-md bg-yellow-500 bg-opacity-80 p-1 text-xs font-bold text-white'>
                    <GoStar className='mr-1' /> 推荐
                  </div>
                )}
              </div>
            </div>
          )}
          <div className='flex w-full'>
            {/* 作者头像 */}
            <figure className='mr-2.5 hidden md:block'>
              <img
                width='75'
                height='75'
                src={author_avatar}
                alt={`${author} avatar`}
                className='block rounded'
              />
            </figure>
            {/* 项目介绍 */}
            <div className='relative flex w-full flex-col truncate'>
              <div className='flex flex-row pb-0.5'>
                <h2 className='flex w-full items-center'>
                  <div className='flex flex-grow items-center truncate text-base leading-snug'>
                    {/* 热点图标 */}
                    {is_hot && (
                      <AiFillFire
                        className='mr-0.5 inline-block align-[-2px]'
                        size={16}
                        style={{ color: 'rgb(226,17,12)' }}
                        aria-label='Hot item'
                      />
                    )}
                    {/* 项目标题和简介 */}
                    <p className='mr-1 truncate text-sm font-normal md:text-[15px]'>
                      <span className='font-semibold dark:text-white'>
                        {name}
                      </span>
                      <span className='mx-0.5 text-gray-500 opacity-40 dark:text-gray-300 md:mx-1'>
                        —
                      </span>
                      <span className='text-gray-600 dark:text-gray-300'>
                        {title}
                      </span>
                    </p>
                  </div>
                  <div className='shrink grow' />
                  {/* 评论数 */}
                  {showCommentCount && comment_total > 0 && (
                    <div className='justify-end'>
                      <div className='h-4 whitespace-nowrap rounded-md bg-blue-400 py-0.5 px-2 text-xs font-semibold leading-none text-white dark:text-gray-100'>
                        {comment_total}
                      </div>
                    </div>
                  )}
                </h2>
              </div>
              {/* 项目描述 */}
              <div className='mt-0.5 truncate text-sm text-gray-400'>
                {summary || '-'}
              </div>
              {/* 技术栈、认证、时间 */}
              <div className='mt-1 flex items-center'>
                <div className='flex grow items-center text-sm text-gray-400'>
                  <img
                    width='20'
                    height='20'
                    src={author_avatar}
                    alt={`${author} small avatar`}
                    className='mr-1 h-4 w-4 rounded-full md:hidden'
                  />
                  <div className='max-w-[6rem] truncate md:max-w-[10rem]'>
                    {is_claimed && (
                      <GoVerified
                        className='mr-0.5 inline-block align-[-2px] text-blue-500'
                        size={13}
                        aria-label='Verified item'
                      />
                    )}
                    {author}
                  </div>
                  <span className='px-1'>·</span>
                  <div className='flex items-center'>
                    <div
                      style={{ backgroundColor: lang_color }}
                      className='h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                    />
                    <div className='max-w-[5rem] truncate pl-0.5 md:max-w-[10rem]'>
                      {primary_lang.split(' ')[0]}
                    </div>
                  </div>
                  <span className='px-1'>·</span>
                  <time
                    dateTime={formattedDate ? formattedDate.toISOString() : ''}
                  >
                    {formattedDate ? fromNow(updated_at) : ''}
                  </time>
                </div>
                {/* 项目 star 数 */}
                {showViewCount && clicks_total !== undefined && (
                  <div className='flex items-center text-sm text-gray-400'>
                    <AiOutlineEye aria-label='Views' />
                    <span className='ml-0.5'>
                      {numFormat(clicks_total, 1, 1000)}
                    </span>
                  </div>
                )}
                {/* 项目查看数 */}
                {stars && (
                  <div className='whitespace-nowrap pl-2 text-sm text-gray-400'>
                    ✨Star {numFormat(stars, 1, 1000)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </LinkComponent>
    </article>
  );
};

export default RepositoryItem;
