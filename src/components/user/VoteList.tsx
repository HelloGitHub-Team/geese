import useVoteHistory from '@/hooks/user/useVoteHistory';

import RepoData from './RepoRecord';

interface Props {
  uid: string;
  t: (key: string) => string;
}

export default function VoteList({ uid, t }: Props) {
  const { data, setPage } = useVoteHistory(uid);

  return data?.data ? (
    data.data.length ? (
      <div className='mt-2'>
        <RepoData data={data} setPage={setPage} />
      </div>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>
          {t('vote.empty')}
        </div>
      </div>
    )
  ) : null;
}
