import classNames from 'classnames';
import { NextPage } from 'next';

import useFilterHandling from '@/hooks/useFilterHandling';

import { RepoModal } from '@/components/dialog/RepoModal';
import { NoPrefetchLink } from '@/components/links/CustomLink';
import RankLink from '@/components/links/rankLink';
import TagLink from '@/components/links/TagLink';

import { indexRankBy } from '@/utils/constants';

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

  const {
    tagLabelStatus,
    tagItems,
    featuredURL,
    allURL,
    handleTagButton,
    monthlyURL,
    yearlyURL,
    rankItems,
  } = useFilterHandling(tid, sortBy, rankBy, i18n_lang, year, month);

  const getSortLinkClassName = (sortName: string, isMobile = false) => {
    const isActive = sortBy === sortName;

    if (isMobile) {
      return classNames(
        'flex h-8 items-center rounded-lg pl-3 pr-3 text-sm font-bold',
        'hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
        {
          'text-gray-500 dark:text-gray-200': !isActive,
          'bg-gray-100 dark:bg-gray-700 text-blue-500': isActive,
          'lg:hidden': sortName === 'label',
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
        <div className='hidden space-x-2 text-sm font-bold md:flex'>
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
        <div className='hidden shrink grow md:block' />
        <div className='hidden gap-2.5 text-[13px] font-medium md:flex'>
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
        {/* 移动端 */}
        <div className='flex md:hidden'>
          <NoPrefetchLink href={featuredURL}>
            <a className={getSortLinkClassName('featured', true)}>
              {t('nav.featured')}
            </a>
          </NoPrefetchLink>
          <NoPrefetchLink href={allURL}>
            <a className={getSortLinkClassName('all', true)}>{t('nav.all')}</a>
          </NoPrefetchLink>
          <span
            onClick={handleTagButton}
            className={getSortLinkClassName('label', true)}
          >
            {t('nav.tag')}
          </span>
        </div>
        <div className='shrink grow md:hidden' />
        <div className='md:hidden'>
          <RepoModal>
            <div className='flex h-8 items-center rounded-lg bg-blue-500 px-3 text-xs text-white active:bg-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:active:bg-gray-900 sm:px-4'>
              {t('nav.submit')}
            </div>
          </RepoModal>
        </div>
      </div>

      {/* 移动端标签 */}
      {tagLabelStatus && (
        <div className='flex px-4 pb-2.5 lg:hidden'>
          <TagLink items={tagItems} tid={tid} sort_by={sortBy} />
        </div>
      )}
      {/* 排行榜 */}
      {rankItems.length > 0 && (
        <div className='hidden px-4 pb-2 md:flex'>
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
