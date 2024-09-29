import classNames from 'classnames';
import { NextPage } from 'next';

import useFilterHandling from '@/hooks/useFilterHandling';

import { NoPrefetchLink } from '@/components/links/CustomLink';
import RankLink from '@/components/links/rankLink';
import TagLink from '@/components/links/TagLink';

import { indexRankBy } from '@/utils/constants';

import { TagLinkListSkeleton } from '../loading/skeleton';

type Props = {
  t: (key: string) => string;
  i18n_lang: string;
  tid?: string;
  sortBy: string;
  rankBy: string;
  year?: number;
  month?: number;
};

const IndexBar: NextPage<Props> = ({
  t,
  i18n_lang,
  tid,
  sortBy,
  rankBy,
  year,
  month,
}) => {
  const defaultURL = '/?sort_by=featured';

  const { tagItems, featuredURL, allURL, monthlyURL, yearlyURL, rankItems } =
    useFilterHandling(tid, sortBy, rankBy, i18n_lang, year, month);

  const getSortLinkClassName = (sortName: string, isMobile = false) => {
    const isActive = sortBy === sortName;

    if (isMobile) {
      return classNames(
        'flex h-8 items-center rounded-lg pl-3 pr-3 text-sm font-bold',
        'hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
        {
          'text-gray-500 dark:text-gray-200': !isActive,
          'bg-gray-100 dark:bg-gray-700 text-blue-500': isActive,
        }
      );
    } else {
      return isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-300';
    }
  };

  const rankLinkClassName = (rankName: string) =>
    classNames(
      'flex h-8 items-center rounded-lg pl-3 pr-3 hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-200': rankBy !== rankName,
        'bg-gray-100 dark:bg-gray-700 text-blue-500': rankBy === rankName,
      }
    );

  return (
    <div className='relative my-2 overflow-hidden bg-white dark:bg-gray-800'>
      <div className='flex h-12 items-center space-x-1 py-2 px-2 md:space-x-2 md:rounded-lg lg:px-4'>
        <div className='flex space-x-1 text-sm font-bold'>
          {indexRankBy.map((rank) => (
            <NoPrefetchLink
              key={rank}
              href={
                rank === 'newest'
                  ? defaultURL
                  : rank === 'monthly'
                  ? monthlyURL
                  : yearlyURL
              }
            >
              <a className={rankLinkClassName(rank)}>{t(`nav.${rank}`)}</a>
            </NoPrefetchLink>
          ))}
        </div>
        <div className='shrink grow' />
        <div className='flex gap-2.5 text-[13px] font-medium'>
          <NoPrefetchLink href={featuredURL}>
            <a className={getSortLinkClassName('featured')}>
              {t('nav.featured')}
            </a>
          </NoPrefetchLink>
          <span className='border-r border-gray-100 dark:border-gray-700'></span>
          <NoPrefetchLink href={allURL}>
            <a className={getSortLinkClassName('all')}>{t('nav.all')}</a>
          </NoPrefetchLink>
        </div>
      </div>

      {/* 移动端标签 */}
      <div className='flex border-t border-gray-100 px-3 pb-2  dark:border-gray-700 lg:hidden'>
        {tagItems.length > 0 ? (
          <TagLink
            items={tagItems}
            tid={tid}
            sort_by={sortBy}
            rank_by={rankBy}
            year={year}
            month={month}
          />
        ) : (
          <TagLinkListSkeleton />
        )}
      </div>
      {/* 排行榜 */}
      {rankItems.length > 0 && (
        <div className='flex px-3 pb-2 lg:px-4'>
          <RankLink
            items={rankItems}
            tid={tid}
            sort_by={sortBy}
            rank_by={rankBy}
            year={year}
            month={month}
          />
        </div>
      )}
    </div>
  );
};

export default IndexBar;
