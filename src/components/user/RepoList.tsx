import { useState } from 'react';

import useRepoHistory from '@/hooks/user/useRepoHistory';

import { EmptyState } from './Common';
import RepoData from './RepoRecord';
import Loading from '../loading/Loading';

import { UserTabProps } from '@/types/user';

const RepoList = ({ uid, t }: UserTabProps) => {
  const [state, setState] = useState(0);
  const { data, setPage } = useRepoHistory(uid, state);
  const categoryItems = [
    { name: t('repo.category_all'), value: 0 },
    { name: t('repo.category_reject'), value: -1 },
    { name: t('repo.category_pending'), value: 1 },
    { name: t('repo.category_pass'), value: 2 },
    { name: t('repo.category_claimed'), value: 3 },
  ];

  const selectState = (e: any) => {
    setState(e.target.value);
  };

  return (
    <div className='mt-2'>
      <div className='text-right'>
        <select
          onChange={selectState}
          className='w-fit cursor-pointer truncate text-ellipsis rounded-md border py-1 pr-7 text-sm dark:bg-gray-700'
        >
          {categoryItems.map((item: any) => (
            <option key={item.name} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {data?.data ? (
        data?.data.length ? (
          <RepoData data={data} setPage={setPage} showStatus={true} />
        ) : (
          <EmptyState message={t('repo.empty')} />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default RepoList;
