import { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';

import { getSelectTags, saveSelectTags } from '@/services/tag';

import BasicDialog from '../dialog/BasicDialog';
import Message from '../message';

import { SelectTag } from '@/types/tag';

const maxTotal = 15;
const defaultTag = { name: '综合', tid: '', icon_name: 'find' };

export function TagModal({
  children,
  updateTags,
}: {
  children: JSX.Element;
  updateTags: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const { isLogin, login } = useLoginContext();
  const [allTags, setAllTags] = useState<SelectTag[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    setTotal(0);
  }

  const openModal = async () => {
    if (!isLogin) {
      return login();
    } else {
      const res = await getSelectTags();
      let selecTotal = 0;
      if (res.success) {
        setAllTags(res.data);
        if (res.data?.length) {
          res.data?.map((item) => {
            if (item.is_selected) {
              selecTotal += 1;
            }
          });
        }
      }
      setTotal(selecTotal);
      setIsOpen(true);
    }
  };

  const saveTags = async () => {
    const tids = [];
    const selectTags = [];
    for (let i = 0; i < allTags.length; i++) {
      if (allTags[i].is_selected) {
        tids.push(allTags[i].tid);
        selectTags.push(allTags[i]);
      }
    }
    selectTags.unshift(defaultTag);
    setLoading(true);
    const res = await saveSelectTags(tids);
    if (res.success) {
      Message.success('保存成功！');
      updateTags(selectTags);
      setIsOpen(false);
    } else {
      Message.error(('保存失败：' + res?.message) as string);
    }
    setLoading(false);
  };

  const handleOnChange = (position: number) => {
    if (total >= maxTotal && !allTags[position].is_selected) {
      Message.error(`标签不能超过${maxTotal}个`);
      return;
    }
    allTags[position].is_selected = !allTags[position].is_selected;

    const totalSelected = allTags.reduce((sum, currentState) => {
      if (currentState.is_selected === true) {
        return sum + 1;
      }
      return sum;
    }, 0);

    setTotal(totalSelected);
  };

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <BasicDialog
        className='w-5/6 max-w-xl rounded-lg p-5'
        visible={isOpen}
        hideClose={true}
        onClose={closeModal}
      >
        <div className='ml-auto box-content w-6 pb-4 pl-4' onClick={closeModal}>
          <VscChromeClose size={24} className='cursor-pointer text-gray-500' />
        </div>
        <div className='grid grid-cols-4 gap-4'>
          {allTags.map((item: SelectTag, index: number) => (
            <div
              key={item.tid}
              className='flex w-full flex-row items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
            >
              <div className='w-full border-gray-200 dark:border-gray-600'>
                <div className='flex items-center pl-2'>
                  <input
                    id={item.tid}
                    type='checkbox'
                    checked={allTags[index].is_selected}
                    onChange={() => handleOnChange(index)}
                    className='h-4 w-4 rounded border-gray-300 dark:border-gray-500 dark:bg-gray-600'
                  />
                  <label
                    htmlFor={item.tid}
                    className='ml-2 w-full py-3 text-sm font-medium dark:text-gray-300'
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            </div>
          ))}

          <FeedbackModal feedbackType={1}>
            <div className='flex w-full cursor-pointer flex-row items-center rounded-lg border border-gray-200 bg-white hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'>
              <div className='w-full border-gray-200 dark:border-gray-600'>
                <div className='flex items-center pl-2'>
                  <IoMdAddCircleOutline size={20} />
                  <span className='ml-2 w-full py-3 text-sm font-medium dark:text-gray-300'>
                    添加标签
                  </span>
                </div>
              </div>
            </div>
          </FeedbackModal>
        </div>

        <div className='mt-4 flex flex-row items-center text-sm text-gray-500'>
          <div className='ml-1'>
            <span className=' font-medium'>已选：</span>
            <span className='font-medium'>
              {total}/{maxTotal}
            </span>
          </div>
          <div className='shrink grow'></div>

          <Button
            variant='primary'
            className='inline-flex w-fit items-center justify-center rounded-lg px-4 py-1.5'
            isLoading={loading}
            onClick={saveTags}
          >
            保存
          </Button>
        </div>
      </BasicDialog>
    </>
  );
}
