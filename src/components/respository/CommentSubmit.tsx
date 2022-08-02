import Image from 'next/image';
import { FormEventHandler } from 'react';

import useCommentData from '@/hooks/useCommentData';
import useLogin from '@/hooks/useLogin';
import useUserInfo from '@/hooks/useUserInfo';

import Rating from '@/components/respository/Rating';

import { submitComment } from '@/services/repository';

import { DEFAULT_AVATAR } from '~/constants';

function CommentSubmit(props: {
  belongId: string;
  className?: string;
  onSuccess?: () => void;
}) {
  const { commentData, setCommentData } = useCommentData();
  const { userInfo } = useUserInfo();
  const { login } = useLogin();
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
    if (!userInfo.avatar) {
      return login();
    }
    submitComment(belongId, commentData).then(() => {
      setCommentData({
        comment: '',
        isUsed: false,
        score: 0,
      });
      onSuccess && onSuccess();
    });
  };

  return (
    <div className={`${className}`}>
      <div className='flex items-start'>
        <div className='avatar mr-4'>
          <div className='relative w-16 rounded-full'>
            <Image
              layout='fill'
              src={userInfo.avatar || DEFAULT_AVATAR}
              alt='头像'
            />
          </div>
        </div>
        <div className='flex-1'>
          <textarea
            className='textarea textarea-bordered w-full'
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
                className='radio radio-sm mr-1'
                checked={!commentData.isUsed}
              />
              <span className='label-text'>未用过</span>
            </label>
            <label
              className='flex cursor-pointer items-center py-2'
              onClick={() => handleRadioChange(true)}
            >
              <input
                type='radio'
                name='radio-1'
                className='radio radio-sm mr-1'
                checked={commentData.isUsed}
              />
              <span className='label-text'>已用过</span>
            </label>
            <div className='h-4 w-[1px] bg-gray-300'></div>
            <div className='flex items-center text-sm'>
              <span>评分：</span>
              <Rating value={commentData.score} onChange={handleChangeRating} />
            </div>
            <button
              className='btn btn-sm ml-auto'
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

export default CommentSubmit;
