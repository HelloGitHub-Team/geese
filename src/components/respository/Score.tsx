import { NextPage } from 'next';

import { RepositoryProps } from '@/types/reppsitory';

const Score: NextPage<RepositoryProps> = ({ repo }) => {
  return (
    <div className='max-full max-h-full w-3/12'>
      <div className='relative mx-auto my-auto pt-2 sm:w-20 lg:w-24'>
        <div className='h-1/2 rounded-t-xl bg-red-600 text-white'>
          <div className='flex flex-col pt-2 text-center'>
            <div className='text-xs'>HG 评分</div>
            <div className='text-base font-bold'>强烈推荐</div>
          </div>
        </div>

        <div className='h-1/2 rounded-b-xl bg-black pt-1'>
          {repo.comment_total ? (
            <div className='pb-1 text-center text-xs text-white'>
              <div>推荐率 {repo.praise_rate}%</div>
              <div>{repo.comment_total} 人评测</div>
            </div>
          ) : (
            <div className='pb-1 text-center text-xs text-white'>
              <div>暂无</div>
              <div>评测数不够</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Score;
