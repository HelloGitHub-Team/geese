import Image from 'next/image';
import { GoThumbsup } from 'react-icons/go';

import useLogin from '@/hooks/useLogin';

import Message from '@/components/message';
import Rating from '@/components/respository/Rating';

import { like, unlike } from '@/services/repository';
import { fromNow } from '@/utils/day';

import { CommentItemData } from '@/types/reppsitory';

import { DEFAULT_AVATAR, NOOP } from '~/constants';

const CommentItem = (
  props: CommentItemData & {
    className?: string;
    /** 是否独自显示，以表示当前用户所发表过的评论 */
    alone?: boolean;
    onChangeVote?: (value: boolean) => void;
  }
) => {
  const {
    cid,
    user,
    score,
    comment,
    votes,
    belong,
    belong_id: belongId,
    is_used: isUsed,
    created_at: createdAt,
    is_voted: isVoted,
    is_show: isShow,
    alone,
    className,
    onChangeVote = NOOP,
  } = props;
  const { isLogin } = useLogin();

  const handleVote = async () => {
    if (isVoted) {
      await unlike({ belong, belongId, cid });
      onChangeVote(false);
    } else if (isLogin) {
      await like({ belong, belongId, cid });
      onChangeVote(true);
    } else {
      Message.error('请先登录！');
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className='mr-4 overflow-hidden rounded-full'>
        <div className='relative h-14 w-14'>
          <Image
            layout='fill'
            src={user?.avatar || DEFAULT_AVATAR}
            alt='头像'
          />
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex items-center gap-4'>
          <span className='text-md'>{user?.nickname}</span>
          <span className='flex items-center text-sm'>
            评分：
            <Rating value={score} />
          </span>
          <span className='text-sm'>{isUsed ? '已用过' : '未用过'}</span>
          <span className='ml-auto text-sm' hidden={!alone}>
            {isShow ? '已精选' : '未精选'}
          </span>
        </div>
        <div className='mt-3 whitespace-pre text-sm text-gray-900'>
          {comment}
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-sm text-[#8a919f]'>{fromNow(createdAt)}</span>
          {alone || (
            <div
              className={`flex cursor-pointer items-center leading-10 text-[#8a919f] hover:text-gray-900 active:text-gray-400 ${
                isVoted ? '!text-blue-500' : ''
              }`}
              onClick={handleVote}
            >
              <GoThumbsup className='mr-1' size={14} />
              <span className='text-sm'>{votes || '点赞'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
