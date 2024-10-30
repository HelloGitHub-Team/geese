import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction } from 'react';

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
        <div className='flex items-center'>
          <span className='font-medium text-red-500'>{t('repo.failed')}</span>
          <Divider />
          <FeedbackModal feedbackType={1}>
            <span className='cursor-pointer'>{t('repo.feedback')}</span>
          </FeedbackModal>
        </div>
      );
    }
    return (
      <span className='font-medium text-yellow-500'>{t('repo.review')}</span>
    );
  }
  return (
    <div className='flex items-center overflow-ellipsis whitespace-nowrap'>
      {showStatus && (
        <>
          <div className='font-medium text-green-500'>
            {item.is_featured ? t('repo.featured') : t('comment.show')}
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

const RepoListItem = ({
  item,
  index,
  pageNum,
  pageSize,
  onClickRepo,
  i18n,
  t,
  showStatus,
}: any) => {
  const itemNumber = (pageNum - 1) * pageSize + index + 1;

  return (
    <div
      key={item.repo.rid}
      onClick={() => onClickRepo(item.repo)}
      className='group relative flex cursor-pointer items-center py-3 px-2
  transition-all duration-200
  after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full
  after:bg-gray-200 after:transition-all
  after:duration-200 hover:bg-gray-50/70
   dark:after:bg-gray-700
  dark:hover:bg-gray-800/30'
    >
      <div className='max-w-full flex-1 space-y-2'>
        <div className=' truncate group-hover:text-blue-500 dark:group-hover:text-blue-400'>
          <h3 className='text-ellipsis text-base font-bold'>
            {itemNumber}. {item.repo.full_name || item.repo.url}
          </h3>
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
    router.push(item.is_show ? `/repository/${item.rid}` : item.url);
  };

  if (!data?.data) return null;
  if (!data.data.length) return <EmptyState message={t('repo.empty')} />;

  return (
    <>
      <div className='space-y-2'>
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
