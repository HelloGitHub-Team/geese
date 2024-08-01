import { useLoginContext } from '@/hooks/useLoginContext';
import useCommentHistory from '@/hooks/user/useCommentHistory';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';
import Pagination from '@/components/pagination/Pagination';
import CommentItem from '@/components/respository/CommentItem';

import { format } from '@/utils/day';

import { TranslationFunction } from '@/types/utils';

interface Props {
  uid: string;
  i18n_lang: string;
  t: TranslationFunction;
}

export const CommentList = ({ uid, t, i18n_lang }: Props) => {
  const { data, setPage } = useCommentHistory(uid);
  const { userInfo, isLogin } = useLoginContext();
  const belongMap = {
    article: t('comment.article'),
    repository: t('comment.repository'),
  };

  if (!data?.data) return null;

  if (!data.data.length) {
    return (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>
          {t('comment.empty')}
        </div>
      </div>
    );
  }

  return (
    <>
      {data.data.map((item, index) => {
        if (!isLogin || !userInfo) return null;

        const commentIndex = (data.page - 1) * data.pageSize + index + 1;
        const formattedDate = format(item.created_at);

        return (
          <div className='p-2' key={item.cid}>
            <div className='flex justify-between py-2'>
              <div className='flex items-center'>
                <span className='mr-2'>{commentIndex}.</span>
                <span className='text-xs text-gray-600 dark:text-gray-300 md:text-sm'>
                  {t('comment.text', { date: formattedDate })}
                </span>
              </div>
              <div className='flex flex-row whitespace-nowrap text-xs md:text-sm'>
                {!item.is_show && (
                  <FeedbackModal feedbackType={4}>
                    <Button
                      className='mr-1 h-7 p-2 font-normal text-red-500 hover:bg-transparent active:bg-transparent'
                      variant='ghost'
                    >
                      {t('comment.button.appeal')}
                    </Button>
                  </FeedbackModal>
                )}
                <a
                  href={`/${item.belong}/${item.belong_id}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Button
                    variant='light'
                    className='h-7 p-2 font-normal dark:border-gray-300 dark:bg-gray-800 dark:text-gray-300'
                  >
                    {t('read_button')}
                  </Button>
                </a>
              </div>
            </div>
            <CommentItem
              className='rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
              key={item.cid}
              t={t}
              i18n_lang={i18n_lang}
              {...item}
              user={userInfo}
              footerRight={() => (
                <span className='text-xs text-gray-400 md:text-sm'>
                  {belongMap[item.belong]}
                  <span className='mx-1'>·</span>
                  {item.is_show ? t('comment.show') : t('comment.unshow')}
                  <span className='mx-1'>·</span>
                  {item.is_hot ? t('comment.hot') : t('comment.unhot')}
                  <span className='mx-1'>·</span>
                  {t('comment.button.vote', { total: item.votes })}
                </span>
              )}
            />
          </div>
        );
      })}
      <Pagination
        hidden={!data.has_more}
        NextText={t('page_next')}
        PreviousText={t('page_prev')}
        current={data.page}
        total={data.page_total}
        onPageChange={setPage}
      />
    </>
  );
};
