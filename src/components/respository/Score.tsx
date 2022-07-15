import { NextPage } from 'next';
import * as React from 'react';

const Score: NextPage = () => {
  return (
    <div className='max-h-full w-3/12'>
      <div className='relative mx-auto my-auto w-20  pt-2 lg:w-24'>
        <div className='h-1/2 rounded-t-xl bg-red-600 text-white'>
          <div className='flex flex-col pt-2 text-center'>
            <div className='text-xs'>HG 评分</div>
            <div className='text-base font-bold'>强烈推荐</div>
          </div>
        </div>

        <div className='h-1/2 rounded-b-xl bg-black pt-1'>
          <div className='pb-1 text-center text-xs text-white'>
            <div>推荐率 62%</div>
            <div>24 人评测</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
