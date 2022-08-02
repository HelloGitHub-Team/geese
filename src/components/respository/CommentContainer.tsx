import CommentSubmit from '@/components/respository/CommentSubmit';

interface Props {
  belongId: string;
  className?: string;
}

const CommentContainer = (props: Props) => {
  const { belongId, className } = props;

  return (
    <div className={className}>
      <CommentSubmit belongId={belongId} />
    </div>
  );
};

export default CommentContainer;
