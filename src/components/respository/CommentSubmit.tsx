import Image from 'next/image';
import { FormEventHandler } from 'react';

import useCommentData from '@/hooks/useCommentData';
import { useLoginContext } from '@/hooks/useLoginContext';
import useUserInfo from '@/hooks/useUserInfo';

import Message from '@/components/message';
import Rating from '@/components/respository/Rating';

import { submitComment } from '@/services/repository';

import { CommentSuccessData } from '@/types/reppsitory';

import { DEFAULT_AVATAR } from '~/constants';

function CommentSubmit(props: {
  belongId: string;
  className?: string;
  onSuccess?: (data: CommentSuccessData) => void;
  onFail?: (error: any) => void;
}) {
  const { commentData, setCommentData } = useCommentData();
  const { userInfo } = useUserInfo();
  const { login, isLogin } = useLoginContext();
  const { belongId, className, onSuccess, onFail } = props;

  const handleInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const { value } = e.currentTarget;
    if (value.length == 0) {
      e.currentTarget.style.height = `58px`;
    } else {
      // 自动增加输入框的高度
      // 2 是 上下两个 border 的高度
      e.currentTarget.style.height = `${e.currentTarget.scrollHeight + 2}px`;
    }

    setCommentData({
      ...commentData,
      comment: value,
      height: e.currentTarget.scrollHeight + 2,
    });
  };

  const handleRadioChange = (isUsed: boolean) => {
    setCommentData({ ...commentData, isUsed });
  };

  const handleChangeRating = (rating: number) => {
    setCommentData({ ...commentData, score: rating });
  };

  const handleSubmit = () => {
    if (getErrMessage(commentData)) {
      return Message.error(getErrMessage(commentData));
    }
    if (!isLogin) {
      return login();
    }
    submitComment(belongId, commentData)
      .then((data) => {
        setCommentData({
          comment: '',
          isUsed: false,
          score: 5,
        });
        if (data.success) {
          onSuccess && onSuccess(data);
          Message.success('发布评论成功');
        } else {
          onFail && onFail(data);
        }
      })
      .catch((err) => {
        Message.error(err.message || '提交评论失败');
      });
  };

  return (
    <div className={`${className}`}>
      <div className='flex items-start'>
        <div className='relative mr-4 hidden sm:inline-flex'>
          <div className='relative aspect-square w-14 overflow-hidden rounded-full'>
            <Image
              layout='fill'
              src={userInfo.avatar || DEFAULT_AVATAR}
              alt='头像'
            />
          </div>
        </div>
        <div className='flex-1'>
          <textarea
            className='min-h-[3rem] w-full flex-shrink rounded-lg bg-white py-2 px-4 text-sm'
            style={{ height: commentData.height }}
            placeholder='写评论...'
            value={commentData.comment}
            onInput={handleInput}
          ></textarea>
          <div className='flex items-center gap-2 text-xs sm:gap-4 sm:text-sm'>
            <label className='flex cursor-pointer items-center py-2'>
              <input
                type='radio'
                name='radio-1'
                className='mr-1 h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded-full border border-gray-400 text-gray-800 focus:border-gray-800 focus:bg-gray-800'
                style={{ boxShadow: 'none' }}
                checked={!commentData.isUsed}
                onChange={() => handleRadioChange(false)}
              />
              <span>未用过</span>
            </label>
            <label className='flex cursor-pointer items-center py-2'>
              <input
                type='radio'
                name='radio-1'
                className='mr-1 h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded-full border border-gray-400 text-gray-800 focus:border-gray-800 focus:bg-gray-800'
                style={{ boxShadow: 'none' }}
                checked={commentData.isUsed}
                onChange={() => handleRadioChange(true)}
              />
              <span>已用过</span>
            </label>
            <div className='h-4 w-[1px] bg-gray-300'></div>
            <div className='flex items-center'>
              <span>评分：</span>
              <Rating
                value={commentData.score}
                onRateChange={handleChangeRating}
              />
            </div>
            <button
              className='ml-auto inline-flex h-8 min-h-[2rem] flex-shrink-0 cursor-pointer select-none flex-wrap items-center justify-center rounded-lg bg-gray-700 pl-3 pr-3 text-sm font-semibold text-white transition-transform active:scale-90 disabled:bg-gray-100 disabled:text-gray-300'
              onClick={handleSubmit}
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getErrMessage(commentData: {
  comment: string;
  isUsed: boolean;
  score: number;
}) {
  if (!commentData.comment) {
    return '评论内容不能为空';
  }
  if (commentData.comment.length < 10) {
    return '评论内容不能少于 10 个字';
  }
  if (commentData.comment.length > 200) {
    return '评论内容不能超过 200 个字';
  }
  if (!commentData.score) {
    return '请评分';
  }
  return '';
}

export default CommentSubmit;
