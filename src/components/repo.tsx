import * as React from 'react';
import { Fragment, useCallback, useState } from 'react';

import { Dialog } from '@/components/dialog';
import Message from '@/components/message';
import { Transition } from '@/components/transition/transition';

import { createRepo } from '@/services/repository';

import { CreateRepoRes } from '@/types/reppsitory';

interface CreateRepoProps {
  response: (res: CreateRepoRes) => void;
}

export default function CreateRepo({ response }: CreateRepoProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const handleCreateRepo = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      e.preventDefault();
      if (loading) {
        return;
      }
      setLoading(true);
      if (validateUrl(url)) {
        createRepo({ url, summary }).then((res) => {
          if (res.success) {
            Message.success(res.message);
          } else {
            Message.warn(res.message);
          }
          response(res);
          setLoading(false);
        });
      } else {
        setLoading(false);
        const message = '请检查项目地址是否符合提交规范.';
        Message.warn(message);
        response({ success: false, message: message });
      }
    },
    [loading, url, summary, response]
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
    <div className='bg-content border-main-content mb-2 mt-2 overflow-hidden p-1'>
      <form onSubmit={handleCreateRepo} className='space-y-4'>
        <div>
          <label className='sr-only' htmlFor='url'>
            url
          </label>
          <input
            className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none'
            placeholder='项目地址（如: https://github.com/xxx/xxx）'
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
            className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none'
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
  );
}

export function RepoModal({ children }: { children: JSX.Element }) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleResponse = (res: CreateRepoRes) => {
    if (res.success) {
      closeModal();
    }
  };

  return (
    <>
      {React.cloneElement(children, { onClick: openModal })}

      <Transition as={Fragment} show={isOpen} appear>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-[48rem] max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <CreateRepo response={handleResponse}></CreateRepo>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
