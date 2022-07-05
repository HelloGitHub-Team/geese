import * as React from 'react';
import useSWR from 'swr';

import { fetcher } from '@/pages/api/base';
import { Stats } from '@/pages/api/home';
import { makeUrl } from '@/utils/api';

export default function Status() {
  const { data: stats } = useSWR<Stats>(makeUrl('/stats/'), fetcher);

  return (
    <div className='space-y-1.5 rounded-lg bg-white px-3 py-2.5'>
      <div className='flex flex-wrap border-b border-b-slate-300 pb-3'>
        <div className='flex-1 pr-4'>
          <div className='whitespace-nowrap text-base text-slate-400'>
            用户总数
          </div>
          <div className='text-4xl'>{stats?.user_total}</div>
        </div>
        <div className='flex-1'>
          <div className='whitespace-nowrap text-base text-slate-400'>
            开源项目
          </div>
          <div className='text-4xl'>{stats?.repo_total}</div>
        </div>
      </div>

      <div className='text-base text-slate-400'>关于本站</div>
      <div className='text-base leading-7'>
        HelloGitHub 是一个分享有趣、 入门级开源项目的平台。
        希望大家能够在这里找到编程的快乐、 轻松搞定问题的技术方案、
        大呼过瘾的开源神器， 顺其自然地开启开源之旅。
      </div>
    </div>
  );
}
