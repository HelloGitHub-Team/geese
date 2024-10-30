import { useLoginContext } from '@/hooks/useLoginContext';
import useCommentHistory from '@/hooks/user/useCommentHistory';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';
import Pagination from '@/components/pagination/Pagination';
import CommentItem from '@/components/respository/CommentItem';

import { format } from '@/utils/day';

import { Divider, EmptyState } from './Common';
import { CustomLink } from '../links/CustomLink';
import Loading from '../loading/Loading';

import { TranslationFunction } from '@/types/utils';

interface CommentListProps {
  uid: string;
  i18n_lang: string;
  t: TranslationFunction;
}

interface BelongType {
  [key: string]: string;
  article: string;
  repository: string;
}

const CommentList: React.FC<CommentListProps> = ({ uid, t, i18n_lang }) => {
  const { data, setPage } = useCommentHistory(uid);
  const { userInfo, isLogin } = useLoginContext();

  const belongMap: BelongType = {
    article: t('comment.article'),
    repository: t('comment.repository'),
  };

  if (!data?.data) return <Loading />;
  if (!data.data.length) return <EmptyState message={t('comment.empty')} />;
  if (!isLogin || !userInfo) return null;

  const renderCommentFooter = (item: any) => (
    <div className='flex text-xs text-gray-400 md:text-sm'>
      {belongMap[item.belong]}
      <Divider />
      {item.is_show ? t('comment.show') : t('comment.unshow')}
      <Divider />
      {item.is_hot ? t('comment.hot') : t('comment.unhot')}
      <Divider />
      {t('comment.button.vote', { total: item.votes })}
    </div>
  );

  const renderActionButtons = (item: any) => (
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
    </div>
  );

  return (
    <>
      {data.data.map((item, index) => {
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
              {renderActionButtons(item)}
            </div>
            <CustomLink href={`/${item.belong}/${item.belong_id}`}>
              <CommentItem
                className='rounded-xl border bg-white p-4 hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500'
                key={item.cid}
                t={t}
                i18n_lang={i18n_lang}
                {...item}
                user={userInfo}
                footerRight={() => renderCommentFooter(item)}
              />
            </CustomLink>
          </div>
        );
      })}
      <Pagination
        hidden={data.page_total === 1}
        NextText={t('page_next')}
        PreviousText={t('page_prev')}
        current={data.page}
        total={data.page_total}
        onPageChange={setPage}
      />
    </>
  );
};

export default CommentList;
