import * as React from 'react';
import useSWR from 'swr';

import { fetcher } from '@/services/base';
import { Stats } from '@/typing/home';
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
          <div className='text-4xl'>{numFormat(stats?.user_total)}</div>
        </div>
        <div className='flex-1'>
          <div className='whitespace-nowrap text-base text-slate-400'>
            开源项目
          </div>
          <div className='text-4xl'>{numFormat(stats?.repo_total)}</div>
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

function numFormat(n: string | undefined, digits = 0) {
  if (n === void 0) {
    return '';
  }
  const num = +n;
  if (num < 10000) {
    return n;
  }
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}
