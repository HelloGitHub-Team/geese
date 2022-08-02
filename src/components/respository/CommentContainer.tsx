import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { GoThumbsup } from 'react-icons/go';

import log from '@/lib/log';

import CommentSubmit from '@/components/respository/CommentSubmit';
import Rating from '@/components/respository/Rating';

import { getComments, like, unlike } from '@/services/repository';
import { fromNow } from '@/utils/day';

import { CommentItemData } from '@/types/reppsitory';

import { DEFAULT_AVATAR, NOOP } from '~/constants';

interface Props {
  belong: string;
  belongId: string;
  className?: string;
}

const CommentItem = (
  props: CommentItemData & {
    className?: string;
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
    className,
    onChangeVote = NOOP,
  } = props;

  const handleVote = async () => {
    if (isVoted) {
      await unlike(cid);
      onChangeVote(false);
    } else {
      await like(belong, belongId, { item_id: cid });
      onChangeVote(true);
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className='avatar mr-4'>
        <div className='relative w-16 rounded-full'>
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
        </div>
        <div className='mt-3 text-sm text-gray-900'>{comment}</div>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#8a919f]'>{fromNow(createdAt)}</span>
          <div
            className={`flex cursor-pointer items-center leading-10 text-[#8a919f] hover:text-gray-900 active:text-gray-400 ${
              isVoted ? 'text-blue-600' : ''
            }`}
            onClick={handleVote}
          >
            <GoThumbsup className='mr-1' size={14} />
            <span className='text-sm'>{votes || '点赞'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentContainer = (props: Props) => {
  const { belong, belongId, className } = props;
  const { list, total, hasMore, loadMore, sortBy, sortType, setList } =
    useCommentList({
      belong,
      belongId,
    });

  const handleChangeVote = (index: number, value: boolean) => {
    list[index].is_voted = value;
    setList([...list]);
  };

  return (
    <div className={`p-4 ${className}`}>
      <h3 className='mb-4'>评论</h3>
      <CommentSubmit belongId={belongId} />
      <div className='my-8 flex items-center justify-between'>
        <strong>{total} 条评论</strong>
        <div className='btn-group'>
          <button
            className={`btn btn-sm ${sortType === 'last' ? 'btn-active' : ''}`}
            onClick={() => sortBy('last')}
          >
            默认
          </button>
          <button
            className={`btn btn-sm ${sortType === 'hot' ? 'btn-active' : ''}`}
            onClick={() => sortBy('hot')}
          >
            最热
          </button>
        </div>
      </div>
      {list.map((item, index) => (
        <CommentItem
          className='mb-6'
          {...item}
          key={item.cid}
          onChangeVote={(value) => handleChangeVote(index, value)}
        />
      ))}
      <div
        hidden={!hasMore}
        className='cursor-pointer rounded-md bg-gray-50 text-center text-sm leading-10 hover:bg-gray-200 active:bg-gray-50'
        onClick={loadMore}
      >
        加载更多...
      </div>
    </div>
  );
};

export default CommentContainer;

function useCommentList({
  belong,
  belongId,
}: {
  belong: string;
  belongId: string;
}) {
  const [list, setList] = useState<CommentItemData[]>([]);
  const [total, setTotal] = useState(0);
  const [currentUserComment, setCurrentUserComment] =
    useState<CommentItemData | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortType, setSortType] = useState('last');

  const fetchData = useCallback(
    async (sortType = 'last') => {
      try {
        const data = await getComments(belong, belongId, 1, sortType);
        setList(data.data);
        setTotal(data.total);
        setCurrentUserComment(data.user_comment);
        setPage(data.page);
        setHasMore(data.has_more);
        setSortType(sortType);
      } catch (err) {
        log.error(err);
      }
    },
    [belong, belongId]
  );

  const sortBy = (type: 'last' | 'hot') => {
    fetchData(type);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await getComments(belong, belongId, nextPage);
    setPage(nextPage);
    setList([...list, ...data.data]);
    setHasMore(data.has_more);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    list,
    total,
    currentUserComment,
    page,
    hasMore,
    loadMore,
    setList,
    refreshList: fetchData,
    sortBy,
    sortType,
  };
}
