import * as React from 'react';
import { useCallback, useState } from 'react';

import { createRepo } from '@/services/repository';

export default function CreateRepo() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');

  const handleCreateRepo = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      e.preventDefault();
      if (validateUrl(url)) {
        createRepo({ url, summary }).then((res) => {
          console.log(res);
        });
      } else {
        console.log('项目地址有误');
      }
    },
    [url, summary]
  );

  const onUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value),
    []
  );
  const onSummaryChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value),
    []
  );

  function validateUrl(url: string) {
    if (/^https:\/\/github.com.*/.test(url)) {
      return true;
    }
    return false;
  }

  return (
    <section className='relative min-h-screen bg-white'>
      <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden'>
        <form onSubmit={handleCreateRepo} className='space-y-4 py-5 px-10'>
          <div>
            <label className='sr-only' htmlFor='url'>
              url
            </label>
            <input
              className='w-full rounded-lg border-gray-200 p-3 text-sm'
              placeholder='项目地址（例如: https://github.com/HelloGitHub-Team/geese）'
              type='text'
              onChange={onUrlChange}
              id='url'
            />
          </div>

          <div>
            <label className='sr-only' htmlFor='summary'>
              summary
            </label>
            <textarea
              className='w-full rounded-lg border-gray-200 p-3 text-sm'
              placeholder='项目介绍'
              rows={8}
              id='summary'
              onChange={onSummaryChange}
            ></textarea>
          </div>

          <div className='mt-4 text-right'>
            <button
              type='submit'
              className='inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-5 py-3 text-white sm:w-auto'
            >
              <span className='font-medium'>提交</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ml-3 h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
