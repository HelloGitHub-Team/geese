import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction } from 'react';

import clsxm from '@/lib/clsxm';

import Pagination from '@/components/pagination/Pagination';

import { format } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { Divider, EmptyState } from './Common';
import { FeedbackModal } from '../dialog/Feedback';

import { Page } from '@/types/help';
import { RepoType, VoteItemData } from '@/types/repository';
import { CollectItem } from '@/types/user';

interface RepoStatusProps {
  item: RepoType;
  t: (key: string) => string;
  showStatus?: boolean;
}

const LanguageIndicator = ({
  color,
  name,
}: {
  color: string;
  name: string;
}) => (
  <span>
    <span
      style={{ backgroundColor: color }}
      className='relative box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
    />
    <span className='whitespace-nowrap pl-0.5'>{name}</span>
  </span>
);

const RepoStatus = ({ item, t, showStatus }: RepoStatusProps) => {
  if (!item.is_show && showStatus) {
    if (item.is_deleted) {
      return (
        <div
          className={clsxm(
            'rounded-full border border-red-100 bg-red-50',
            'px-2 py-0.5 text-red-600',
            'dark:border-red-800 dark:bg-red-900/30 dark:text-red-400',
            'flex items-center text-xs'
          )}
        >
          <span className='mr-1 h-1.5 w-1.5 rounded-full bg-red-500' />
          <span>{t('repo.category_reject')}</span>
          <span className='mx-1.5 text-gray-300 dark:text-gray-600'>|</span>
          <span className='opacity-85'>{t('repo.appeal')}</span>
        </div>
      );
    }
    return (
      <div
        className={clsxm(
          'rounded-full border border-yellow-100 bg-yellow-50',
          'px-2 py-0.5 text-yellow-600',
          'dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          'flex items-center text-xs'
        )}
      >
        <span className='mr-1 h-1.5 w-1.5 rounded-full bg-yellow-500' />
        <span>{t('repo.category_pending')}</span>
        <span className='mx-1.5 text-gray-300 dark:text-gray-600'>|</span>
        <span className='opacity-85'>{t('repo.feedback')}</span>
      </div>
    );
  }
  return (
    <div className='flex items-center overflow-ellipsis whitespace-nowrap'>
      {showStatus && (
        <>
          <div
            className={clsxm(
              'rounded-full border border-green-100 bg-green-50',
              'px-2 py-0.5 text-green-600',
              'dark:border-green-800 dark:bg-green-900/30 dark:text-green-400',
              'flex items-center text-xs'
            )}
          >
            <span className='mr-1 h-1.5 w-1.5 rounded-full bg-green-500' />
            <span>
              {item.is_featured
                ? t('repo.category_featured')
                : t('repo.category_pass')}
            </span>
          </div>
          <Divider />
        </>
      )}
      <LanguageIndicator color={item.lang_color} name={item.primary_lang} />
      <Divider />
      <div>{numFormat(item.stars, 1)}</div>
    </div>
  );
};

interface RepoListItemProps {
  item: {
    repo: RepoType;
    created_at: string;
  };
  index: number;
  pageNum: number;
  pageSize: number;
  onClickRepo: (repo: RepoType) => void;
  i18n: {
    language: string;
  };
  t: (key: string) => string;
  showStatus?: boolean;
}

const RepoListItem = ({
  item,
  index,
  pageNum,
  pageSize,
  onClickRepo,
  i18n,
  t,
  showStatus,
}: RepoListItemProps) => {
  const itemNumber = (pageNum - 1) * pageSize + index + 1;

  const handleItemClick = (item: RepoType) => {
    if (!item.is_show) {
      return;
    }
    onClickRepo(item);
  };

  return (
    <div
      key={item.repo.rid}
      onClick={() => handleItemClick(item.repo)}
      className='group relative flex cursor-pointer items-center py-3 px-2
        transition-all duration-200
        after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full
        after:bg-gray-200 after:transition-all
        after:duration-200 
        hover:bg-gray-50/70 dark:hover:bg-gray-800/30'
    >
      <div className='max-w-full flex-1 space-y-2'>
        <div className='group-hover:text-blue-500 dark:group-hover:text-blue-400'>
          <span className='block truncate text-ellipsis whitespace-nowrap text-base font-bold'>
            {itemNumber}. {item.repo.full_name || item.repo.url}
          </span>
        </div>
        <p className='text-gray-400 line-clamp-2 dark:text-gray-300'>
          {i18n.language === 'en'
            ? item.repo.summary_en || item.repo.summary
            : item.repo.summary || '-'}
        </p>
        <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
          <RepoStatus item={item.repo} t={t} showStatus={showStatus} />
          <Divider />
          <time dateTime={item.created_at}>{format(item.created_at)}</time>
        </div>
      </div>
      {!item.repo.is_show && (
        <FeedbackModal feedbackType={item.repo.is_deleted ? 1 : 4}>
          <div className='absolute inset-0' />
        </FeedbackModal>
      )}
    </div>
  );
};

interface RepoDataProps {
  data: Page<CollectItem | VoteItemData>;
  setPage: Dispatch<SetStateAction<number>>;
  showStatus?: boolean;
}

const RepoData = ({ data, setPage, showStatus }: RepoDataProps) => {
  const { t, i18n } = useTranslation('profile');
  const router = useRouter();

  const onClickRepo = (item: RepoType) => {
    router.push(item.is_show ? `/repository/${item.full_name}` : item.url);
  };

  if (!data?.data) return null;
  if (!data.data.length) return <EmptyState message={t('repo.empty')} />;

  return (
    <>
      <div className='space-y-1'>
        {data.data.map((item, index) => (
          <RepoListItem
            key={item.repo.rid}
            item={item}
            index={index}
            pageNum={data.page}
            pageSize={data.pageSize}
            onClickRepo={onClickRepo}
            i18n={i18n}
            t={t}
            showStatus={showStatus}
          />
        ))}
      </div>

      <Pagination
        className='mt-2'
        hidden={data.page_total === 1}
        PreviousText={t('page_prev')}
        NextText={t('page_next')}
        current={data.page}
        total={data.page_total}
        onPageChange={setPage}
      />
    </>
  );
};

export default RepoData;
