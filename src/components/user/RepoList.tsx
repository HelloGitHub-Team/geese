import { useState } from 'react';

import useRepoHistory from '@/hooks/user/useRepoHistory';

import { EmptyState } from './Common';
import RepoData from './RepoRecord';
import Loading from '../loading/Loading';

import { UserTabProps } from '@/types/user';

const categoryItems = [
  { name: '不限', value: 0 },
  { name: '未通过', value: -1 },
  { name: '待审核', value: 1 },
  { name: '已通过', value: 2 },
];

const RepoList = ({ uid, t }: UserTabProps) => {
  const [state, setState] = useState(0);
  const { data, setPage } = useRepoHistory(uid, state);

  const selectState = (e: any) => {
    setState(e.target.value);
  };

  return (
    <div className='mt-2'>
      <div className='text-right'>
        <select
          onChange={selectState}
          className='w-fit truncate text-ellipsis rounded-md border py-1 pr-7 text-sm dark:bg-gray-700'
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
