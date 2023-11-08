import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IoIosCloseCircleOutline,
  IoMdAddCircleOutline,
  IoMdBulb,
} from 'react-icons/io';
import Sortable from 'sortablejs';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import { FeedbackModal } from '@/components/dialog/Feedback';
import GroupItem from '@/components/dialog/GroupItem';
import Message from '@/components/message';

import { getSelectTags, saveSelectTags } from '@/services/tag';

import BasicDialog from '../dialog/BasicDialog';

import { maxTotal, PortalTag, PortalTagGroup } from '@/types/tag';

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
  const [portalTagGroups, setPortalTagGroups] = useState<PortalTagGroup[]>([]);
  const [effectedTidList, setEffectedTidList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const portalTagGroupsRef = useRef(portalTagGroups);
  const targetBox = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    setIsOpen(false);
    setTotal(0);
  };

  const openModal = async () => {
    if (!isLogin) {
      return login();
    } else {
      const res = await getSelectTags();
      if (res.success) {
        setPortalTagGroups(res.data);
        setEffectedTidList(res.effected);
        setIsOpen(true);
      } else {
        Message.error('获取标签失败');
      }
    }
  };

  const autoReorderTags = () => {
    const items = document.querySelectorAll('.target-box > *');
    const tidList = Array.from(items).map(
      (m) => (m as HTMLElement).dataset.tid ?? ''
    );
    setEffectedTidList(tidList);
  };

  const addTag = useCallback(
    (tid: string) => {
      if (effectedTidList.includes(tid)) return;
      if (effectedTidList.length >= maxTotal) return;
      const tidList = [...effectedTidList, tid];
      setEffectedTidList(tidList);
    },
    [effectedTidList]
  );

  const removeTag = (tid?: string) => {
    if (tid) {
      const newTidList = effectedTidList.filter((f) => f !== tid);
      setEffectedTidList(newTidList);
    }
  };

  const saveTags = async () => {
    if (effectedTidList.length <= maxTotal) {
      const selectTags = [];
      selectTags.unshift(defaultTag);
      for (let i = 0; i < effectedTidList.length; i++) {
        const item = portalTagGroups
          .map((m) => m.tags)
          .flat()
          .find((f) => f.tid === effectedTidList[i]);
        selectTags.push(item);
      }
      setLoading(true);
      const res = await saveSelectTags(effectedTidList);
      if (res.success) {
        Message.success('保存成功！');
        updateTags(selectTags);
        setIsOpen(false);
      } else {
        Message.error(('保存失败：' + res?.message) as string);
      }
      setLoading(false);
    } else {
      Message.error(`最多只能选择 ${maxTotal} 个标签`);
    }
  };

  useEffect(() => {
    setTotal(effectedTidList.length);
    if (targetBox.current) {
      const sortableTarget = new Sortable(targetBox.current, {
        group: { name: '_target', put: true },
        draggable: '.target-item',
        ghostClass: 'w-[110px]',
        onSort: function ({ item }) {
          if (item.classList.contains('drag-item')) {
            autoReorderTags();
            item.remove();
          } else {
            setTimeout(() => {
              autoReorderTags();
            }, 120);
          }
        },
      });
      return () => {
        sortableTarget.destroy();
      };
    }
  }, [total, autoReorderTags]);

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <BasicDialog
        className='w-10/12 xl:w-8/12 2xl:w-7/12 rounded-lg p-5'
        visible={isOpen}
        onClose={closeModal}
      >
        <div className='flex items-center mb-4 text-gray-500 dark:text-gray-200'>
          <IoMdBulb />
          <span className='text-sm'>
            操作提示：点击或拖拽标签到右边侧为「选择」，拖拽已选标签可「排序」
          </span>
        </div>
        <div className='flex flex-wrap'>
          <div className='w-2/3 pr-3'>
            {portalTagGroups.map((group: PortalTagGroup, index: number) => [
              <div
                key={'group_' + index}
                className='text-lg font-medium text-gray-500 dark:text-gray-200'
              >
                {group.group_name}
              </div>,
              <div
                key={'group_items_' + index}
                className='dnd-source-group grid grid-cols-6 gap-3 py-3'
                data-group={group.group_name}
              >
                {group.tags.map((item: PortalTag) => (
                  <GroupItem
                    key={item.tid}
                    item={item}
                    effectedTidList={effectedTidList}
                    groupName={group.group_name}
                    portalTagGroupsRef={portalTagGroupsRef}
                    handleAddTag={addTag}
                  />
                ))}
              </div>,
            ])}
          </div>
          <div className='w-1/3 border-l pl-3'>
            <div className='text-lg font-medium text-gray-500 dark:text-gray-200'>
              已选：{total}
              <span className='px-0.5'>/</span>
              {maxTotal}
            </div>
            <div
              ref={targetBox}
              className='target-box flex h-[400px] flex-col flex-wrap gap-3 pt-3'
            >
              {effectedTidList.map((tid: string, index: number) => {
                const item = portalTagGroups
                  .map((m) => m.tags)
                  .flat()
                  .find((f) => f.tid === tid);
                const itemGroupName = portalTagGroups.find((g) =>
                  g.tags.some((s) => s.tid === tid)
                )?.group_name;
                return (
                  <div
                    key={item?.tid}
                    data-group={itemGroupName}
                    data-tid={item?.tid}
                    className='target-item relative flex w-28 rounded-full border border-gray-200 text-white hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'
                  >
                    <div className='flex w-full cursor-pointer flex-wrap  border-gray-200 font-medium dark:border-gray-600'>
                      <div className='h-6 w-6 rounded-full bg-gray-400 text-center text-white dark:bg-white dark:text-gray-700'>
                        {index + 1}
                      </div>
                      <div className='flex-1 truncate text-ellipsis px-2 py-0.5 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-300'>
                        {item?.name}
                      </div>
                    </div>
                    <span
                      className='absolute -right-1.5 -top-1.5 h-4 w-4 cursor-pointer rounded-full
                                 text-lg text-gray-300'
                      onClick={() => removeTag(item?.tid)}
                    >
                      <IoIosCloseCircleOutline
                        className='rounded-full bg-white hover:bg-white hover:text-orange-600 dark:bg-gray-700'
                        size={15}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='mt-4 flex flex-row items-center gap-4 text-sm text-gray-500'>
          <div className='shrink grow' />
          <FeedbackModal feedbackType={1}>
            <div className='flex w-full cursor-pointer flex-row items-center rounded-lg border border-gray-200 bg-white hover:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-500'>
              <div className='w-full border-gray-200 dark:border-gray-600'>
                <div className='flex items-center pl-2'>
                  <IoMdAddCircleOutline size={20} />
                  <span className='w-full px-1 py-1.5 text-sm font-medium dark:text-gray-300'>
                    添加标签
                  </span>
                </div>
              </div>
            </div>
          </FeedbackModal>
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
