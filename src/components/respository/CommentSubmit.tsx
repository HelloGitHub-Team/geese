import Image from 'next/image';
import { FormEventHandler, useEffect, useState } from 'react';

import useLogin from '@/hooks/useLogin';
import useUserInfo from '@/hooks/useUserInfo';

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
    <div className={`${className} bg-white p-4`}>
      <h3 className=' mb-4'>评论</h3>
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
              <div className='rating rating-sm'>
                <input
                  type='radio'
                  name='rating-1'
                  className='mask mask-star'
                  checked={commentData.score === 1}
                  onClick={() => handleChangeRating(1)}
                />
                <input
                  type='radio'
                  name='rating-1'
                  className='mask mask-star'
                  checked={commentData.score === 2}
                  onClick={() => handleChangeRating(2)}
                />
                <input
                  type='radio'
                  name='rating-1'
                  className='mask mask-star'
                  checked={commentData.score === 3}
                  onClick={() => handleChangeRating(3)}
                />
                <input
                  type='radio'
                  name='rating-1'
                  className='mask mask-star'
                  checked={commentData.score === 4}
                  onClick={() => handleChangeRating(4)}
                />
                <input
                  type='radio'
                  name='rating-1'
                  className='mask mask-star'
                  checked={commentData.score === 5}
                  onClick={() => handleChangeRating(5)}
                />
              </div>
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

function useCommentData() {
  const storageKey = 'COMMENT_DATA';
  const [commentData, setCommentData] = useState({
    comment: '',
    isUsed: false,
    score: 0,
  });

  useEffect(() => {
    setCommentData(JSON.parse(localStorage.getItem(storageKey) || '{}'));
  }, []);

  const storeCommentData = (data: {
    comment: string;
    isUsed: boolean;
    score: number;
  }) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setCommentData(data);
  };

  return {
    commentData,
    setCommentData: storeCommentData,
  };
}

export default CommentSubmit;
