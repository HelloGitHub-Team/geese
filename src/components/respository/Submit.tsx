import { Fragment, useCallback, useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';

import { useLoginContext } from '@/hooks/useLoginContext';

import BasicDialog from '@/components/dialog/BasicDialog';
import Message from '@/components/message';

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
            Message.success(`提交成功，您还可以提交 ${res.remaining} 次`);
          } else {
            Message.error(res.message);
          }
          response(res);
          setLoading(false);
        });
      } else {
        setLoading(false);
        const message = '地址必须是由 https://github.com 开头';
        Message.error(message);
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
    <div className='overflow-hidden p-1'>
      <form onSubmit={handleCreateRepo} className='space-y-4'>
        <div>
          <label className='sr-only' htmlFor='url'>
            url
          </label>
          <input
            className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
            placeholder='项目地址（如：https://github.com/521xueweihan/HelloGitHub）'
            type='text'
            id='url'
            onChange={onUrlChange}
          />
          <div className='mt-2 text-left text-xs text-gray-400'>
            👆 仅接受 GitHub 上的开源项目
          </div>
        </div>

        <div>
          <label className='sr-only' htmlFor='summary'>
            summary
          </label>
          <textarea
            className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
            placeholder='请填写项目描述：这是个什么项目、能用来干什么、有什么特点或解决了什么痛点，适用于什么场景、能够让初学者学到什么'
            rows={8}
            id='summary'
            onChange={onSummaryChange}
          ></textarea>
          <div className='mt-2 text-left text-xs text-gray-400'>
            字数限制 10-200 个字符
          </div>
        </div>

        <div className='mt-4 text-right'>
          <button
            type='submit'
            className='inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-5 py-3 text-white dark:bg-gray-600 dark:text-gray-300 sm:w-auto'
          >
            <span className='font-medium'>提交</span>
            <IoIosArrowRoundForward size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}

export function RepoModal({ children }: { children: JSX.Element }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLogin, login } = useLoginContext();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    if (!isLogin) {
      return login();
    }
    setIsOpen(true);
  }

  const handleResponse = (res: CreateRepoRes) => {
    if (res.success) {
      closeModal();
    }
  };

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <BasicDialog
        className='w-5/6 max-w-xl rounded-lg p-5'
        visible={isOpen}
        onClose={closeModal}
      >
        <div className='ml-auto box-content w-6 pb-4 pl-4' onClick={closeModal}>
          <VscChromeClose size={24} className='cursor-pointer text-gray-500' />
        </div>
        <CreateRepo response={handleResponse}></CreateRepo>
      </BasicDialog>
    </>
  );
}
