import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import BasicDialog from '@/components/dialog/BasicDialog';
import { CustomLink } from '@/components/links/CustomLink';
import Message from '@/components/message';

import { checkRepo, createRepo } from '@/services/repository';

import { CheckRepoRes, CreateRepoRes } from '@/types/repository';

interface CreateRepoProps {
  response: (res: CreateRepoRes) => void;
  t: (key: string, total?: any) => any;
}

export function CreateRepo({ response, t }: CreateRepoProps) {
  const { userInfo } = useLoginContext();
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
      setURLMessage(t('submit_repo.create_err'));
      isEmpty = true;
    }
    if (title.length == 0) {
      setTitleMessage(t('submit_repo.create_err2'));
      isEmpty = true;
    }
    if (summary.length == 0) {
      setSummaryMessage(t('submit_repo.create_err3'));
      isEmpty = true;
    }
    // 有一个条件不满足就不能提交
    if (loading || !paramReady || isEmpty) {
      return;
    }
    setLoading(true);
    const res = await createRepo({ url, summary, title });
    if (res.success) {
      Message.success(
        t('submit_repo.create_success', { remaining: res.remaining })
      );
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
      setURLMessage(t('submit_repo.check_url_err'));
      return;
    }
    checkRepo(url)
      .then((res: CheckRepoRes) => {
        if (res.success) {
          if (res.data.is_exist) {
            setURLMessage(res.message || t('submit_repo.check_url_err2'));
            setParamReady(false);
          } else {
            setURLMessage('');
            setParamReady(true);
          }
        } else {
          setURLMessage(t('submit_repo.check_url_err3'));
          setParamReady(false);
        }
      })
      .catch((err) => {
        setURLMessage(t('submit_repo.check_url_err4'));
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
        setTitleMessage(t('submit_repo.create_err2'));
        setParamReady(false);
      }
      if (title.length > 50) {
        setTitleMessage(t('submit_repo.create_err4'));
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
          setSummaryMessage(t('submit_repo.create_err3'));
          setParamReady(false);
        }
        if (summay.length > 300) {
          setSummaryMessage(t('submit_repo.create_err5'));
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
          placeholder={t('submit_repo.url_placeholder')}
          type='text'
          id='url'
          onChange={onUrlChange}
          onBlur={onUrlBlur}
        />
        <div className='ml-1 mt-2 text-left text-xs text-gray-400'>
          {urlMessage ? (
            <span className='text-red-600'>{urlMessage}</span>
          ) : (
            t('submit_repo.url_tip')
          )}
        </div>
      </div>

      <div>
        <input
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          placeholder={t('submit_repo.title_placeholder')}
          type='text'
          id='title'
          onChange={onTitleChange}
          onBlur={onTitleBlur}
        />
        <div className='mt-2 text-left text-xs text-gray-400'>
          {titleMessage && <span className='text-red-600'>{titleMessage}</span>}
        </div>
      </div>

      <div>
        <textarea
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          placeholder={t('submit_repo.summary_placeholder')}
          rows={8}
          id='summary'
          onChange={onSummaryChange}
          onBlur={onSummaryBlur}
        ></textarea>
        <div className='mt-2 flex items-center justify-between text-left text-xs text-gray-400'>
          <div>
            {summaryMessage ? (
              <span className='text-red-600'>{summaryMessage}</span>
            ) : (
              t('submit_repo.summary_tip')
            )}
          </div>
          <CustomLink className='inline' href={`/user/${userInfo?.uid}/repo`}>
            <span className='cursor-pointer text-blue-500 hover:text-blue-600'>
              {t('submit_repo.view_repo')}
            </span>
          </CustomLink>
        </div>
      </div>

      <div className='mt-4 text-right'>
        <Button
          variant='primary'
          className='w-full items-center justify-center rounded-lg px-5 py-3 sm:w-auto'
          isLoading={loading}
          onClick={handleCreateRepo}
        >
          {t('submit_repo.text')}
          <IoIosArrowRoundForward size={24} />
        </Button>
      </div>
    </div>
  );
}

interface RepoModalProps {
  children: JSX.Element;
}

export function RepoModal({ children }: RepoModalProps) {
  const { t } = useTranslation('common');
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
            {t('submit_repo.title')}
            <p className='mt-2 mb-2 text-xs text-gray-500'>
              {t('submit_repo.description')}
            </p>
          </>
        }
        onClose={closeModal}
      >
        <CreateRepo response={handleResponse} t={t} />
      </BasicDialog>
    </>
  );
}
