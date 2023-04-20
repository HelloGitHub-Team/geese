import { useCallback, useState } from 'react';
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

const FeedbackOptions = [
  { key: 'feedback', value: 1, name: '建议', title: '建议改善' },
  { key: 'bug', value: 2, name: 'Bug', title: '问题反馈' },
  { key: 'bussiess', value: 3, name: '商务', title: '商务合作' },
  { key: 'other', value: 4, name: '其它', title: '畅所欲言' },
];

interface CreateFeedbackProps {
  response: (res: CreateFeedbackRes) => void;
  setTitle: any;
  feedbackType: number;
}

export function CreateFeedback({
  response,
  feedbackType,
  setTitle,
}: CreateFeedbackProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<number>(feedbackType);
  const [content, setContent] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [contentMessage, setContentMessage] = useState<string>('');

  const handleFeedback = async () => {
    if (content.length > 0) {
      setLoading(true);
      const res = await createFeedback({ content, selectOption, contact });
      if (res.success) {
        Message.success('提交反馈成功！');
      } else {
        Message.error(res.message);
      }
      setLoading(false);
      response(res);
    } else {
      setContentMessage('内容不能为空');
    }
  };

  const onContentBlur = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputContent = e.target.value;
      if (inputContent.length > 0 && inputContent.length <= 1000) {
        setContentMessage('');
      } else {
        if (inputContent.length < 1) {
          setContentMessage('内容不能为空');
        }
        if (inputContent.length > 1000) {
          setContentMessage('内容不能超过 1000 个字');
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
          placeholder='请在这里留下您反馈的详情，我会认真阅读并及时做出响应。'
          onChange={onContentChange}
          onBlur={onContentBlur}
        />
        <div className='mt-2 text-left text-xs text-gray-400'>
          {contentMessage ? (
            <span className='text-red-600'>{contentMessage}</span>
          ) : (
            '字数限制 1-1000 字符'
          )}
        </div>
      </div>
      {selectOption == 3 && (
        <div>
          <input
            className='focus:ring-shadow-1 w-full rounded border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-400'
            placeholder='联系方式：微信/手机号/邮箱'
            type='text'
            id='contact'
            onChange={onContactChange}
          />
        </div>
      )}

      <div className='mt-4 text-right'>
        <Button
          variant='primary'
          className='w-full items-center justify-center rounded-lg px-5 py-3 sm:w-auto'
          isLoading={loading}
          onClick={handleFeedback}
        >
          提交
          <IoIosArrowRoundForward size={24} />
        </Button>
      </div>
    </div>
  );
}

export function FeedbackModal({
  children,
  feedbackType,
}: {
  children: JSX.Element;
  feedbackType: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>(
    FeedbackOptions[feedbackType - 1].title
  );

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

  const handleResponse = (res: CreateFeedbackRes) => {
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
            {title}
            <p className='mt-2 mb-2 text-xs text-gray-500'></p>
          </>
        }
        onClose={closeModal}
      >
        <CreateFeedback
          response={handleResponse}
          feedbackType={feedbackType}
          setTitle={setTitle}
        />
      </BasicDialog>
    </>
  );
}
