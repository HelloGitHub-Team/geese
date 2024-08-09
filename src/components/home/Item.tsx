import Link from 'next/link';
import { AiFillFire, AiOutlineEye } from 'react-icons/ai';
import { GoStar, GoVerified } from 'react-icons/go';

import { CustomLink } from '@/components/links/CustomLink';

import { fromNow } from '@/utils/day';
import { numFormat } from '@/utils/util';

interface ItemProps {
  item: {
    item_id?: string;
    rid?: string;
    author_avatar: string;
    is_hot?: boolean;
    is_featured?: boolean;
    is_claimed?: boolean;
    name: string;
    title: string;
    title_en?: string;
    comment_total?: number;
    summary?: string;
    summary_en?: string;
    author: string;
    lang_color: string;
    primary_lang: string;
    publish_at?: string;
    updated_at?: string;
    clicks_total?: number;
    stars?: number;
  };
  i18n_lang: string;
  index?: number;
  showCommentCount?: boolean;
  showViewCount?: boolean;
  linkType?: 'default' | 'custom';
}

const RepositoryItem = ({
  item,
  index,
  i18n_lang,
  showCommentCount = false,
  showViewCount = false,
  linkType = 'default',
}: ItemProps) => {
  const {
    item_id,
    rid,
    author_avatar,
    is_hot,
    is_featured,
    is_claimed,
    name,
    title,
    title_en,
    comment_total,
    summary,
    summary_en,
    author,
    lang_color,
    primary_lang,
    publish_at,
    updated_at,
    clicks_total,
    stars,
  } = item;

  const LinkComponent = linkType === 'custom' ? CustomLink : Link;
  const href =
    linkType === 'custom' ? `/repository/${item_id}` : `/repository/${rid}`;
  const showDatetime = showCommentCount ? '' : 'hidden md:inline';

  // 动态绑定类名
  const ClassName = `transform shadow-lg transition-transform ${
    showViewCount ? 'hover:scale-105' : ''
  }`;

  return (
    <div className='overflow-hidden'>
      <article className={ClassName}>
        <LinkComponent href={href} aria-label={`Repository ${name}`}>
          <header className='relative cursor-pointer bg-white px-2.5 py-3 hover:bg-gray-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:px-4'>
            {/* 项目序号和标题 */}
            {index !== undefined && (
              <div className='pb-0.5'>
                <div className='text-color-primary flex justify-between visited:text-gray-500 dark:text-gray-300'>
                  <span className='truncate text-sm leading-snug  md:text-base'>
                    {index + 1}
                    <span className='pr-0.5'>.</span>
                    {i18n_lang == 'en' ? title_en || title : title || '-'}
                  </span>
                  {/* 是否推荐 */}
                  {is_featured && (
                    <div className='absolute top-0 right-0 flex items-center rounded-bl-md bg-yellow-500 bg-opacity-80 p-1 text-xs font-bold text-white'>
                      <GoStar className='mr-1' />{' '}
                      {i18n_lang == 'en' ? 'Featured' : '推荐'}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className='flex w-full'>
              {/* 作者头像 */}
              {showViewCount && (
                <figure className='mr-2.5 hidden md:block'>
                  <img
                    width='75'
                    height='75'
                    src={author_avatar}
                    alt={`${author} avatar`}
                    className='block rounded'
                  />
                </figure>
              )}
              {/* 项目介绍 */}
              <div className='relative flex w-full flex-col truncate'>
                <div className='flex flex-row pb-0.5'>
                  <h2 className='flex w-full items-center'>
                    <div className='flex flex-grow items-center truncate text-base leading-snug'>
                      {/* 热点图标 */}
                      {is_hot && (
                        <AiFillFire
                          className='mr-0.5 inline-block min-w-min align-[-2px]'
                          size={16}
                          style={{ color: 'rgb(226,17,12)' }}
                          aria-label='Hot item'
                        />
                      )}
                      {/* 项目标题和简介 */}
                      {showViewCount && (
                        <p className='mr-1 truncate text-sm font-normal md:text-[15px]'>
                          <span className='font-semibold dark:text-white'>
                            {name}
                          </span>
                          <span className='mx-0.5 text-gray-500 opacity-40 dark:text-gray-300 md:mx-1'>
                            —
                          </span>
                          <span className='text-gray-600 dark:text-gray-300'>
                            {i18n_lang == 'en'
                              ? title_en || title
                              : title || '-'}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className='shrink grow' />
                    {/* 评论数 */}
                    {showCommentCount && (comment_total || 0) > 0 && (
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
                  {i18n_lang == 'en' ? summary_en || summary : summary || '-'}
                </div>
                {/* 技术栈、认证、时间 */}
                <div className='mt-1 flex items-center'>
                  <div className='flex grow items-center text-sm text-gray-400'>
                    {linkType !== 'custom' && (
                      <div className='flex items-center truncate whitespace-nowrap md:max-w-xs'>
                        <img
                          width='20'
                          height='20'
                          src={author_avatar}
                          className='bg-img h-5 w-5 rounded md:mr-1'
                        />
                        <span className='hidden truncate md:inline'>
                          {author}
                        </span>
                        <span className='px-1'>·</span>
                      </div>
                    )}
                    {showViewCount && (
                      <img
                        width='20'
                        height='20'
                        src={author_avatar}
                        alt={`${author} small avatar`}
                        className='mr-1 h-4 w-4 rounded-full md:hidden'
                      />
                    )}
                    <div className='flex max-w-[7rem] items-center truncate text-ellipsis md:w-fit md:max-w-[10rem]'>
                      {is_claimed && (
                        <GoVerified
                          className='mr-0.5 inline-block min-w-min align-[-2px] text-blue-500'
                          size={13}
                          aria-label='Verified item'
                        />
                      )}
                      <div className='truncate'>{name}</div>
                    </div>
                    <span className='px-1'>·</span>
                    <span>
                      <span
                        style={{ backgroundColor: lang_color }}
                        className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
                      />
                      <span className='whitespace-nowrap pl-0.5'>
                        {primary_lang.split(' ')[0]}
                      </span>
                    </span>

                    <span className={showDatetime}>
                      <span className='px-1'>·</span>
                      <time>
                        {fromNow(updated_at || publish_at || '', i18n_lang)}
                      </time>
                    </span>
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
    </div>
  );
};

export default RepositoryItem;
