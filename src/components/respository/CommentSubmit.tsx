import Image from 'next/image';
import { FormEventHandler } from 'react';

import { showMessage } from '@/lib/showMessage';
import useCommentData from '@/hooks/useCommentData';
import useLogin from '@/hooks/useLogin';
import useUserInfo from '@/hooks/useUserInfo';

import Rating from '@/components/respository/Rating';

import { submitComment } from '@/services/repository';

import { CommentSuccessData } from '@/types/reppsitory';

import { DEFAULT_AVATAR } from '~/constants';

function CommentSubmit(props: {
  belongId: string;
  className?: string;
  onSuccess?: (data: CommentSuccessData) => void;
}) {
  const { commentData, setCommentData } = useCommentData();
  const { userInfo } = useUserInfo();
  const { login, isLogin } = useLogin();
  const { belongId, className, onSuccess } = props;

  const handleInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const { value } = e.currentTarget;
    setCommentData({ ...commentData, comment: value });
  };

  const handleRadioChange = (isUsed: boolean) => {
    setCommentData({ ...commentData, isUsed });
  };

  const handleChangeRating = (rating: number) => {
    setCommentData({ ...commentData, score: rating });
  };

  const handleSubmit = () => {
    if (!isLogin) {
      return login();
    }
    if (getErrMessage(commentData)) {
      return showMessage(getErrMessage(commentData));
    }
    submitComment(belongId, commentData)
      .then((data) => {
        setCommentData({
          comment: '',
          isUsed: false,
          score: 0,
        });
        onSuccess && onSuccess(data);
      })
      .catch((err) => {
        showMessage(err.message || '提交评论失败');
      });
  };

  return (
    <div className={`${className}`}>
      <div className='flex items-start'>
        <div className='relative mr-4 inline-flex'>
          <div className='relative aspect-square w-16 overflow-hidden rounded-full'>
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
            placeholder='写评论...'
            value={commentData.comment}
            onInput={handleInput}
          ></textarea>
          <div className='flex items-center gap-4'>
            <label
              className='flex cursor-pointer items-center py-2'
              onClick={() => handleRadioChange(false)}
            >
              <input
                type='radio'
                name='radio-1'
                className='mr-1 h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded-full border border-gray-400 text-gray-800 focus:border-gray-800 focus:bg-gray-800'
                style={{ boxShadow: 'none' }}
                checked={!commentData.isUsed}
              />
              <span className='text-sm'>未用过</span>
            </label>
            <label
              className='flex cursor-pointer items-center py-2'
              onClick={() => handleRadioChange(true)}
            >
              <input
                type='radio'
                name='radio-1'
                className='mr-1 h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded-full border border-gray-400 text-gray-800 focus:border-gray-800 focus:bg-gray-800'
                style={{ boxShadow: 'none' }}
                checked={commentData.isUsed}
              />
              <span className='text-sm'>已用过</span>
            </label>
            <div className='h-4 w-[1px] bg-gray-300'></div>
            <div className='flex items-center text-sm'>
              <span>评分：</span>
              <Rating value={commentData.score} onChange={handleChangeRating} />
            </div>
            <button
              className='ml-auto inline-flex h-8 min-h-[2rem] flex-shrink-0 cursor-pointer select-none flex-wrap items-center justify-center rounded-lg bg-gray-700 pl-3 pr-3 text-sm font-semibold text-white transition-transform active:scale-90 disabled:bg-gray-100 disabled:text-gray-300'
              disabled={!commentData.comment || !commentData.score}
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
