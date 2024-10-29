import useVoteHistory from '@/hooks/user/useVoteHistory';

import { EmptyState } from './Common';
import RepoData from './RepoRecord';
import Loading from '../loading/Loading';

import { UserTabProps } from '@/types/user';

const VoteList = ({ uid, t }: UserTabProps) => {
  const { data, setPage } = useVoteHistory(uid);

  if (!data?.data) return <Loading />;
  if (!data.data.length) return <EmptyState message={t('vote.empty')} />;

  return (
    <div className='mt-2'>
      <RepoData data={data} setPage={setPage} />
    </div>
  );
};

export default VoteList;
