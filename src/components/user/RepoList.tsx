import useRepoHistory from '@/hooks/user/useRepoHistory';

import RepoData from './RepoRecord';

interface Props {
  uid: string;
  t: (key: string) => string;
}

export default function RepoList({ uid, t }: Props) {
  const { data, setPage } = useRepoHistory(uid);

  return data?.data ? (
    data.data.length ? (
      <div className='mt-2'>
        <RepoData data={data} setPage={setPage} />
      </div>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>
          {t('repo.empty')}
        </div>
      </div>
    )
  ) : null;
}
