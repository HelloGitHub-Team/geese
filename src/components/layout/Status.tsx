import * as React from 'react';

const Status = () => {
  return (
    <div className='space-y-1.5 rounded-lg bg-white px-3 py-2.5'>
      <div className='flex border-b border-b-slate-200 pb-3'>
        <div className='flex-1 pr-2'>
          <div className='text-sm text-slate-400'>用户总数</div>
          <div className='text-3xl'>4136</div>
        </div>
        <div className='flex-1 pl-2'>
          <div className='text-sm text-slate-400'>开源项目</div>
          <div className='text-3xl'>1694</div>
        </div>
      </div>

      <div className='text-sm text-slate-400'>关于本站</div>
      <div className='text-sm leading-6'>
        HelloGitHub 是一个分享有趣、入门级开源项目的平台。
        希望大家能够在这里找到编程的快乐、轻松搞定问题的技术方案、大呼过瘾的开源神器，顺其自然地开启开源之旅。
      </div>
    </div>
  );
};

export default Status;
