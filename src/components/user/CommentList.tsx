import useCommentHistory from '@/hooks/user/useCommentHistory';
import useUserDetailInfo from '@/hooks/user/useUserDetailInfo';

import Pagination from '@/components/pagination/Pagination';
import CommentItem from '@/components/respository/CommentItem';

interface Props {
  uid: string;
}

export default function CommentList(props: Props) {
  const { data, setPage } = useCommentHistory(props.uid);
  const userInfo = useUserDetailInfo(props.uid);

  return data ? (
    <>
      {data.data.map((item) => {
        return userInfo ? (
          <CommentItem key={item.cid} {...item} user={userInfo} alone />
        ) : null;
      })}
      <Pagination
        NextText='下一页'
        PreviousText='上一页'
        current={data.page}
        total={data.page_total}
        onPageChange={setPage}
      />
    </>
  ) : null;
}
