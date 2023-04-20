import { useCallback, useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import BasicDialog from '@/components/dialog/BasicDialog';
import Message from '@/components/message';

import { checkRepo, createRepo } from '@/services/repository';

import { CheckRepoRes, CreateRepoRes } from '@/types/reppsitory';

interface CreateRepoProps {
  response: (res: CreateRepoRes) => void;
}

export function CreateRepo({ response }: CreateRepoProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [paramReady, setParamReady] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [urlMessage, setURLMessage] = useState<string>('');
  const [titleMessage, setTitleMessage] = useState<string>('');
  const [summaryMessage, setSummaryMessage] = useState<string>('');

  const handleCreateRepo = useCallback(async () => {
    let isEmpty = false;
    if (url.length == 0) {
      setURLMessage('地址不能为空');
      isEmpty = true;
    }
    if (title.length == 0) {
      setTitleMessage('标题不能少于 5 个字');
      isEmpty = true;
    }
    if (summary.length == 0) {
      setSummaryMessage('描述不能少于 10 个字');
      isEmpty = true;
    }
    // 有一个条件不满足就不能提交
    if (loading || !paramReady || isEmpty) {
      return;
    }
    setLoading(true);
    const res = await createRepo({ url, summary, title });
    if (res.success) {
      Message.success(`感谢您的分享！您还可以提交 ${res.remaining} 次`);
    } else {
      Message.error(res.message);
    }
    response(res);
    setLoading(false);
  }, [loading, url, title, summary, paramReady, response]);

  function validateUrl(url: string) {
    if (/^https:\/\/github.com.*/.test(url)) {
      return true;
    }
    return false;
  }

  const onUrlBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!validateUrl(url)) {
      setURLMessage('地址必须是 https://github.com 开头');
      return;
    }
    checkRepo(url)
      .then((res: CheckRepoRes) => {
        if (res.success) {
          if (res.data.is_exist) {
            setURLMessage(res.message || '该项目已存在，换一个试试吧~');
            setParamReady(false);
          } else {
            setURLMessage('');
            setParamReady(true);
          }
        } else {
          setURLMessage('地址不合规');
          setParamReady(false);
        }
      })
      .catch((err) => {
        setURLMessage('请求失败，稍后重试');
        setParamReady(false);
        console.error(err);
      });
  }, []);

  const onTitleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (title.length >= 5 && title.length <= 50) {
      setTitleMessage('');
      setParamReady(true);
    } else {
      if (title.length < 5) {
        setTitleMessage('标题不能少于 5 个字');
        setParamReady(false);
      }
      if (title.length > 50) {
        setTitleMessage('标题不能超过 50 个字');
        setParamReady(false);
      }
    }
  }, []);

  const onSummaryBlur = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const summay = e.target.value;
      if (summay.length >= 10 && summay.length <= 300) {
        setSummaryMessage('');
        setParamReady(true);
      } else {
        if (summay.length < 10) {
          setSummaryMessage('描述不能少于 10 个字');
          setParamReady(false);
        }
        if (summay.length > 300) {
          setSummaryMessage('描述不能超过 300 个字');
          setParamReady(false);
        }
      }
    },
    []
  );

  const onUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value),
    []
  );

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );

  const onSummaryChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value),
    []
  );

  return (
    <div className='space-y-4 overflow-hidden p-1'>
      <div>
        <input
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          placeholder='项目地址'
          type='text'
          id='url'
          onChange={onUrlChange}
          onBlur={onUrlBlur}
        />
        <div className='ml-1 mt-2 text-left text-xs text-gray-400'>
          {urlMessage ? (
            <span className='text-red-600'>{urlMessage}</span>
          ) : (
            '👆 仅接受 GitHub 上的开源项目'
          )}
        </div>
      </div>

      <div>
        <input
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          placeholder='标题：请用一句话介绍项目'
          type='text'
          id='title'
          onChange={onTitleChange}
          onBlur={onTitleBlur}
        />
        <div className='mt-2 text-left text-xs text-gray-400'>
          {titleMessage ? (
            <span className='text-red-600'>{titleMessage}</span>
          ) : (
            ''
          )}
        </div>
      </div>

      <div>
        <textarea
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          placeholder='描述：请从技术栈、功能、适用场景、解决了哪些痛点等方面介绍项目，突出特点和闪光的亮点。'
          rows={8}
          id='summary'
          onChange={onSummaryChange}
          onBlur={onSummaryBlur}
        ></textarea>
        <div className='mt-2 text-left text-xs text-gray-400'>
          {summaryMessage ? (
            <span className='text-red-600'>{summaryMessage}</span>
          ) : (
            '字数限制 10-300 字符'
          )}
        </div>
      </div>

      <div className='mt-4 text-right'>
        <Button
          variant='primary'
          className='w-full items-center justify-center rounded-lg px-5 py-3 sm:w-auto'
          isLoading={loading}
          onClick={handleCreateRepo}
        >
          提交
          <IoIosArrowRoundForward size={24} />
        </Button>
      </div>
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
        hideClose={false}
        title={
          <>
            欢迎<span className='mx-0.5 font-medium'>自荐/分享</span>开源项目
            <p className='mt-2 mb-2 text-xs text-gray-500'>
              通过审核的开源项目，才会在首页展示
            </p>
          </>
        }
        onClose={closeModal}
      >
        <CreateRepo response={handleResponse}></CreateRepo>
      </BasicDialog>
    </>
  );
}
