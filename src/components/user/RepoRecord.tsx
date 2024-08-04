import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction } from 'react';

import Button from '@/components/buttons/Button';
import Pagination from '@/components/pagination/Pagination';

import { format } from '@/utils/day';
import { numFormat } from '@/utils/util';

import { FeedbackModal } from '../dialog/Feedback';

import { Page } from '@/types/help';
import { RepoType, VoteItemData } from '@/types/repository';
import { CollectItem } from '@/types/user';

const RepoData = ({
  data,
  setPage,
}: {
  data: Page<CollectItem | VoteItemData>;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  const { t, i18n } = useTranslation('profile');
  const router = useRouter();

  const onClickRepo = (item: RepoType) => {
    router.push(item.is_show ? `/repository/${item.rid}` : item.url);
  };

  const RepoStatus = ({ item }: { item: RepoType }) => {
    if (item.is_show) {
      return (
        <>
          <div className='font-medium text-green-500'>
            {item.is_featured ? t('repo.featured') : t('comment.show')}
          </div>
          <div className='px-1'>·</div>
          <div>
            <span
              style={{ backgroundColor: item.lang_color }}
              className='relative mr-1 box-border inline-block h-3 w-3 rounded-full border border-gray-100 align-[-1px] dark:border-gray-500'
            />
            {item.primary_lang}
          </div>
          <div className='px-1'>·</div>
          <div>{numFormat(item.stars, 1)}</div>
        </>
      );
    } else {
      if (item.is_deleted) {
        return (
          <>
            <span className='font-medium text-red-500'>{t('repo.failed')}</span>
            <div className='px-1'>·</div>
            <FeedbackModal feedbackType={1}>
              <span className='cursor-pointer'>{t('repo.feedback')}</span>
            </FeedbackModal>
          </>
        );
      } else {
        return (
          <span className='font-medium text-yellow-500'>
            {t('repo.review')}
          </span>
        );
      }
    }
  };

  return data?.data ? (
    data.data.length ? (
      <div>
        {data.data.map((item, index: number) => (
          <div
            key={item.repo.rid}
            className='flex items-center border-t py-3 first:border-t-0 dark:border-gray-700'
          >
            <div className='mr-3 self-start'>
              {(data.page - 1) * data.pageSize + index + 1}.
            </div>
            <div className='flex-1 pr-2'>
              <div className='font-bold'>{item.repo.name || item.repo.url}</div>
              <div className='my-2 flex'>
                <span className='w-px max-w-fit flex-1 items-stretch overflow-hidden text-ellipsis whitespace-nowrap text-gray-400 dark:text-gray-300'>
                  {i18n.language == 'en'
                    ? item.repo.summary_en || item.repo.summary
                    : item.repo.summary || '-'}
                </span>
              </div>
              <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                <RepoStatus item={item.repo} />
                <div className='px-1'>·</div>
                <div>{format(item.created_at)}</div>
              </div>
            </div>
            <Button
              variant='light'
              className='h-10 p-2 font-normal dark:border-gray-300 dark:bg-gray-800 dark:text-gray-300'
              onClick={() => onClickRepo(item.repo)}
            >
              {t('read_button')}
            </Button>
          </div>
        ))}
        <Pagination
          className='mt-2'
          hidden={!data.has_more}
          PreviousText={t('page_prev')}
          NextText={t('page_next')}
          current={data.page}
          total={data.page_total}
          onPageChange={setPage}
        />
      </div>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>
          {t('repo.empty')}
        </div>
      </div>
    )
  ) : null;
};

export default RepoData;
