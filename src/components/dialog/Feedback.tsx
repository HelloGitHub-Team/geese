import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import BasicDialog from '@/components/dialog/BasicDialog';
import Message from '@/components/message';

import { createFeedback } from '@/services/home';

import { CreateFeedbackRes } from '@/types/home';

interface Option {
  key: string;
  value: number;
  name: string;
  title: string;
}

const getFeedbackOptions = (t: (key: string) => string) => [
  {
    key: 'feedback',
    value: 1,
    name: t('feedback.options.feedback.name'),
    title: t('feedback.options.feedback.title'),
  },
  { key: 'bug', value: 2, name: 'Bug', title: t('feedback.options.bug.title') },
  {
    key: 'bussiess',
    value: 3,
    name: t('feedback.options.bussiess.name'),
    title: t('feedback.options.bussiess.title'),
  },
  {
    key: 'other',
    value: 4,
    name: t('feedback.options.other.name'),
    title: t('feedback.options.other.title'),
  },
];

interface CreateFeedbackProps {
  response: (res: CreateFeedbackRes) => void;
  setTitle: any;
  feedbackType: number;
  t: (key: string) => string;
}

export function CreateFeedback({
  response,
  feedbackType,
  setTitle,
  t,
}: CreateFeedbackProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<number>(feedbackType);
  const [content, setContent] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [contentMessage, setContentMessage] = useState<string>('');
  const FeedbackOptions = getFeedbackOptions(t);

  const handleFeedback = async () => {
    if (content.length > 0) {
      setLoading(true);
      const res = await createFeedback({ content, selectOption, contact });
      if (res.success) {
        Message.success(t('feedback.success'));
      } else {
        Message.error(res.message);
      }
      setLoading(false);
      response(res);
    } else {
      setContentMessage(t('feedback.err'));
    }
  };

  const onContentBlur = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputContent = e.target.value;
      if (inputContent.length > 0 && inputContent.length <= 1000) {
        setContentMessage('');
      } else {
        if (inputContent.length < 1) {
          setContentMessage(t('feedback.err'));
        }
        if (inputContent.length > 1000) {
          setContentMessage(t('feedback.err2'));
        }
      }
    },
    []
  );

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const onContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };
  const changeOption = (item: Option) => {
    setSelectOption(item.value);
    setTitle(item.title);
  };

  return (
    <div className='space-y-4 overflow-hidden p-1'>
      <div className='flex'>
        {FeedbackOptions.map((item: Option) => (
          <div key={item.key} className='mr-4 flex items-center'>
            <input
              id={item.key}
              type='radio'
              value={item.value}
              name={item.name}
              checked={item.value == selectOption}
              onChange={() => changeOption(item)}
              className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
            />
            <label
              htmlFor={item.key}
              className='ml-1.5 cursor-pointer text-sm font-medium text-gray-500 dark:text-gray-300'
            >
              {item.name}
            </label>
          </div>
        ))}
      </div>

      <div>
        <textarea
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          rows={8}
          id='content'
          placeholder={t('feedback.content_placeholder')}
          onChange={onContentChange}
          onBlur={onContentBlur}
        />
        <div className='mt-2 text-left text-xs text-gray-400'>
          {contentMessage ? (
            <span className='text-red-600'>{contentMessage}</span>
          ) : (
            t('feedback.limit')
          )}
        </div>
      </div>
      <div>
        <input
          className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
          placeholder={t('feedback.contact_placeholder')}
          type='text'
          id='contact'
          onChange={onContactChange}
        />
      </div>

      <div className='mt-4 text-right'>
        <Button
          variant='primary'
          className='w-full items-center justify-center rounded-lg px-5 py-3 sm:w-auto'
          isLoading={loading}
          onClick={handleFeedback}
        >
          {t('feedback.submit')}
          <IoIosArrowRoundForward size={24} />
        </Button>
      </div>
    </div>
  );
}

type FeedbackModalProps = {
  children: React.ReactElement;
  feedbackType: number;
};

export function FeedbackModal({ children, feedbackType }: FeedbackModalProps) {
  const { t, i18n } = useTranslation('common');
  const FeedbackOptions = getFeedbackOptions(t);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>(
    FeedbackOptions[feedbackType - 1].title
  );

  const { isLogin, login } = useLoginContext();

  useEffect(() => {
    setTitle(FeedbackOptions[feedbackType - 1].title);
  }, [i18n.language]);

  const closeModal = useCallback(() => setIsOpen(false), []);
  const openModal = useCallback(() => {
    if (!isLogin) {
      login();
      return;
    }
    setIsOpen(true);
  }, [isLogin, login]);

  const handleResponse = useCallback(
    (res: CreateFeedbackRes) => {
      if (res.success) {
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <BasicDialog
        className='w-5/6 max-w-xl rounded-lg p-5'
        visible={isOpen}
        hideClose={false}
        title={
          <>
            {title}
            <p className='my-2' />
          </>
        }
        onClose={closeModal}
      >
        <CreateFeedback
          response={handleResponse}
          feedbackType={feedbackType}
          setTitle={setTitle}
          t={t}
        />
      </BasicDialog>
    </>
  );
}
