import useRepoHistory from '@/hooks/user/useRepoHistory';

import RepoData from './RepoRecord';

interface Props {
  uid: string;
}

export default function RepoList(props: Props) {
  const { data, setPage } = useRepoHistory(props.uid);

  return data?.data ? (
    data.data.length ? (
      <div className='mt-2'>
        <RepoData data={data} setPage={setPage} />
      </div>
    ) : (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>暂无项目</div>
      </div>
    )
  ) : null;
}
