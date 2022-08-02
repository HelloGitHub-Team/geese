import useCommentList from '@/hooks/useCommentList';

import CommentItem from '@/components/respository/CommentItem';
import CommentSubmit from '@/components/respository/CommentSubmit';

interface Props {
  belong: string;
  belongId: string;
  className?: string;
}

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
