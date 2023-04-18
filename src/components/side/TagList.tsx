import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineAppstore, AiOutlineSetting } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';

import { useLoginContext } from '@/hooks/useLoginContext';

import { getSelectTags, getTags, saveSelectTags } from '@/services/tag';
import { isMobile } from '@/utils/util';

import BasicDialog from '../dialog/BasicDialog';
import { TagListSkeleton } from '../loading/skeleton';
import Message from '../message';

import { SelectTag, Tag } from '@/types/tag';

const maxTotal = 15;
const defaultTag = { name: '综合', tid: '', icon_name: 'find' };

export function TagModal({
  children,
  updateTags,
}: {
  children: JSX.Element;
  updateTags: any;
}) {
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
    const res = await saveSelectTags(tids);
    if (res.success) {
      Message.success('保存成功！');
      updateTags(selectTags);
      setIsOpen(false);
    } else {
      Message.error(('保存失败：' + res?.message) as string);
    }
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
              className='flex w-full flex-row items-center rounded-lg border border-gray-200 bg-white hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
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
          <a
            target='_blank'
            className='cursor-pointer hover:text-blue-500'
            href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
            rel='noreferrer'
          >
            <div className='flex w-full flex-row items-center rounded-lg border border-gray-200 bg-white hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'>
              <div className='w-full border-gray-200 dark:border-gray-600'>
                <div className='flex items-center pl-2'>
                  <IoMdAddCircleOutline size={20} />
                  <span className='ml-2 w-full py-3 text-sm font-medium dark:text-gray-300'>
                    添加标签
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className='mt-4 flex flex-row items-center'>
          <div className='ml-1'>
            <span>已选：</span>
            <span className='font-medium'>
              {total}/{maxTotal}
            </span>
          </div>
          <div className='shrink grow'></div>
          <button
            onClick={saveTags}
            className='inline-flex w-fit items-center justify-center rounded-lg bg-blue-500 px-4 py-1.5 text-white dark:bg-gray-600 dark:text-gray-300'
          >
            <span className='font-medium'>保存</span>
          </button>
        </div>
      </BasicDialog>
    </>
  );
}

export default function TagList() {
  const router = useRouter();
  const { tid = '' as string } = router.query;
  const [tags, setTags] = useState<Tag[]>([]);

  const initTags = async () => {
    const res = await getTags();
    if (res.success) {
      res.data.unshift(defaultTag);
      setTags(res.data);
    }
  };

  useEffect(() => {
    if (!isMobile()) {
      initTags();
    }
  }, []);

  const iconClassName = (iconName: string) =>
    classNames(`iconfont icon-${iconName} mr-1`);

  const tagClassName = (itemTid: string) =>
    classNames(
      'flex flex-row w-[112px] items-center my-1 py-2 px-3 rounded text-[14px] cursor-pointer hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-400': tid !== itemTid,
        'bg-gray-100 dark:bg-gray-700 text-blue-500': tid == itemTid,
      }
    );

  return (
    <div className='hidden max-w-[162px] shrink-0 lg:block lg:w-2/12 lg:grow-0'>
      <div className='fixed top-16 pl-3'>
        <div className='rounded-lg bg-white px-3 py-2 dark:bg-gray-800'>
          <div className='px-1 pb-1'>
            <div className='border-b border-b-gray-200 pb-2 dark:border-b-gray-600 dark:text-gray-300'>
              <div className='flex w-[104px] flex-row items-center p-1'>
                <AiOutlineAppstore size={16} />
                <div className='ml-1 font-medium'>热门标签</div>
              </div>
            </div>
          </div>
          <div className='custom-scrollbar max-h-[444px] overflow-y-auto'>
            {!tags.length && <TagListSkeleton />}
            {tags.map((item: Tag) => (
              <Link key={item.tid} href={`/?sort_by=last&tid=${item.tid}`}>
                <div className={tagClassName(item.tid)}>
                  <div className={iconClassName(item.icon_name)}></div>
                  <div className='truncate text-ellipsis'>{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
          <TagModal updateTags={setTags}>
            <div className='flex cursor-pointer flex-row items-center border-t border-t-gray-200 px-3 pt-2 pb-1 hover:text-blue-500 dark:border-t-gray-600 dark:text-gray-300 dark:hover:text-blue-500'>
              <AiOutlineSetting size={15} />
              <div className='ml-1 text-sm'>管理标签</div>
            </div>
          </TagModal>
        </div>
      </div>
    </div>
  );
}
