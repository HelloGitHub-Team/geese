import { useLoginContext } from '@/hooks/useLoginContext';
import useCommentHistory from '@/hooks/user/useCommentHistory';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';
import Pagination from '@/components/pagination/Pagination';
import CommentItem from '@/components/respository/CommentItem';

import { formatZH } from '@/utils/day';

interface Props {
  uid: string;
}

export const CommentList = (props: Props) => {
  const { data, setPage } = useCommentHistory(props.uid);
  const { userInfo, isLogin } = useLoginContext();
  const belongMap = {
    article: '文章',
    repository: '项目',
  };

  return data?.data ? (
    data.data.length ? (
      <>
        {data.data.map((item, index) => {
          return isLogin && userInfo ? (
            <div className='p-2' key={item.cid}>
              <div className='flex justify-between py-2'>
                <div className='flex items-center'>
                  <span className='mr-2'>
                    {(data.page - 1) * data.pageSize + index + 1}.
                  </span>
                  <span className='text-xs text-gray-600 dark:text-gray-300 md:text-sm'>
                    在 {formatZH(item.created_at, 'YYYY 年 MM 月 DD 日 ')}{' '}
                    发布的评论
                  </span>
                </div>

                <div className='flex flex-row whitespace-nowrap text-xs md:text-sm'>
                  {item.is_show ? (
                    <></>
                  ) : (
                    <FeedbackModal feedbackType={4}>
                      <Button
                        className='mr-1 h-7 p-2 font-normal text-red-500 hover:bg-transparent active:bg-transparent'
                        variant='ghost'
                      >
                        申诉
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
                      查看
                    </Button>
                  </a>
                </div>
              </div>
              <CommentItem
                className='rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
                key={item.cid}
                {...item}
                user={userInfo}
                footerRight={() => (
                  <span className='text-xs text-gray-400 md:text-sm'>
                    {belongMap[item.belong]}
                    <span className='mx-1'>·</span>
                    {item.is_show ? '已展示' : '未展示'}
                    <span className='mx-1'>·</span>
                    {item.is_hot ? '热评' : '非热评'}
                    <span className='mx-1'>·</span>点赞 {item.votes}
                  </span>
                )}
              />
            </div>
          ) : null;
        })}
        <Pagination
          hidden={!data.has_more}
          NextText='下一页'
          PreviousText='上一页'
          current={data.page}
          total={data.page_total}
          onPageChange={setPage}
        />
      </>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>暂无评论</div>
      </div>
    )
  ) : null;
};
